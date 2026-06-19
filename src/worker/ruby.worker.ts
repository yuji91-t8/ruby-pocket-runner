/// <reference lib="webworker" />
import { RubyVM } from "@ruby/wasm-wasi";
import { WASI, File, OpenFile, PreopenDirectory } from "@bjorn3/browser_wasi_shim";
import rubyWasmUrl from "@ruby/3.2-wasm-wasi/dist/ruby+stdlib.wasm?url";
import type { WorkerInboundMessage, WorkerOutboundMessage } from "./protocol";

function post(message: WorkerOutboundMessage) {
  (self as DedicatedWorkerGlobalScope).postMessage(message);
}

function createOutputPrinter() {
  let memory: WebAssembly.Memory | undefined;
  const decoder = new TextDecoder();

  return {
    setMemory(m: WebAssembly.Memory) {
      memory = m;
    },
    addToImports(imports: WebAssembly.Imports) {
      const wasiImport = imports.wasi_snapshot_preview1 as Record<string, (...args: number[]) => number>;
      const originalFdWrite = wasiImport.fd_write;
      wasiImport.fd_write = (fd: number, iovs: number, iovsLen: number, nwritten: number) => {
        if ((fd !== 1 && fd !== 2) || !memory) {
          return originalFdWrite(fd, iovs, iovsLen, nwritten);
        }
        const view = new DataView(memory.buffer);
        let written = 0;
        let text = "";
        for (let i = 0; i < iovsLen; i++) {
          const ptr = iovs + i * 8;
          const bufPtr = view.getUint32(ptr, true);
          const bufLen = view.getUint32(ptr + 4, true);
          text += decoder.decode(new Uint8Array(memory.buffer, bufPtr, bufLen));
          written += bufLen;
        }
        view.setUint32(nwritten, written, true);
        post({ type: fd === 1 ? "stdout" : "stderr", text });
        return 0;
      };
    },
  };
}

async function setupVM(): Promise<RubyVM> {
  const response = await fetch(rubyWasmUrl);
  const buffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(buffer);

  const wasi = new WASI(
    [],
    [],
    [new OpenFile(new File([])), new OpenFile(new File([])), new OpenFile(new File([])), new PreopenDirectory("/", new Map())],
    { debug: false },
  );

  const printer = createOutputPrinter();
  const { vm } = await RubyVM.instantiateModule({
    module,
    wasip1: wasi,
    addToImports: (imports) => printer.addToImports(imports),
    setMemory: (memory) => printer.setMemory(memory),
  });

  // Ruby buffers stdout/stderr by default; the VM never exits between
  // runs (no atexit flush), so without sync the output is lost.
  vm.eval("STDOUT.sync = true; STDERR.sync = true");

  return vm;
}

let vmPromise: Promise<RubyVM> | null = null;
function getVM(): Promise<RubyVM> {
  if (!vmPromise) vmPromise = setupVM();
  return vmPromise;
}

getVM()
  .then(() => post({ type: "ready" }))
  .catch((error) => post({ type: "load-error", message: errorMessage(error) }));

self.onmessage = async (event: MessageEvent<WorkerInboundMessage>) => {
  const message = event.data;
  if (message.type !== "run") return;

  const { code, runId } = message;
  try {
    const vm = await getVM();
    vm.eval(code);
    post({ type: "done", runId, ok: true });
  } catch (error) {
    post({ type: "stderr", text: errorMessage(error) + "\n" });
    post({ type: "done", runId, ok: false });
  }
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
