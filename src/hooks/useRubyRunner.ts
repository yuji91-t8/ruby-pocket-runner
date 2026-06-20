import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerInboundMessage, WorkerOutboundMessage } from "../worker/protocol";

const RUN_TIMEOUT_MS = 3000;

export type RunStatus = "loading" | "ready" | "running" | "load-error" | "error";

export interface OutputChunk {
  id: number;
  stream: "stdout" | "stderr" | "system";
  text: string;
}

function createWorker(): Worker {
  return new Worker(new URL("../worker/ruby.worker.ts", import.meta.url), { type: "module" });
}

export function useRubyRunner() {
  const workerRef = useRef<Worker | null>(null);
  const runIdRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const chunkIdRef = useRef(0);
  const [status, setStatus] = useState<RunStatus>("loading");
  const [output, setOutput] = useState<OutputChunk[]>([]);

  const appendChunk = useCallback((stream: OutputChunk["stream"], text: string) => {
    setOutput((prev) => [...prev, { id: chunkIdRef.current++, stream, text }]);
  }, []);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const attachWorker = useCallback(() => {
    const worker = createWorker();
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerOutboundMessage>) => {
      const message = event.data;
      switch (message.type) {
        case "ready":
          setStatus("ready");
          break;
        case "load-error":
          setStatus("load-error");
          appendChunk("system", `Rubyランタイムの読み込みに失敗しました: ${message.message}`);
          break;
        case "stdout":
          appendChunk("stdout", message.text);
          break;
        case "stderr":
          appendChunk("stderr", message.text);
          break;
        case "done":
          if (message.runId === runIdRef.current) {
            clearTimer();
            setStatus(message.ok ? "ready" : "error");
          }
          break;
      }
    };

    worker.onerror = (event) => {
      clearTimer();
      appendChunk("system", `ワーカーで予期しないエラーが発生しました: ${event.message}`);
      setStatus("load-error");
    };

    return worker;
  }, [appendChunk, clearTimer]);

  useEffect(() => {
    const worker = attachWorker();
    return () => {
      clearTimer();
      worker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = useCallback(
    (code: string) => {
      const worker = workerRef.current;
      if (!worker || status === "running" || status === "loading") return;

      runIdRef.current += 1;
      const runId = runIdRef.current;
      setOutput([]);
      setStatus("running");

      const message: WorkerInboundMessage = { type: "run", code, runId };
      worker.postMessage(message);

      timeoutRef.current = window.setTimeout(() => {
        if (runId !== runIdRef.current) return;
        worker.terminate();
        appendChunk(
          "system",
          `実行が${RUN_TIMEOUT_MS / 1000}秒を超えたため強制終了しました(無限ループの可能性があります)。`,
        );
        setStatus("loading");
        attachWorker();
      }, RUN_TIMEOUT_MS);
    },
    [status, appendChunk, attachWorker],
  );

  const reload = useCallback(() => {
    clearTimer();
    workerRef.current?.terminate();
    setStatus("loading");
    attachWorker();
  }, [attachWorker, clearTimer]);

  const clearOutput = useCallback(() => {
    setOutput([]);
    setStatus((prev) => (prev === "error" ? "ready" : prev));
  }, []);

  return { status, output, run, clearOutput, reload };
}
