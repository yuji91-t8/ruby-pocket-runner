export type WorkerInboundMessage = {
  type: "run";
  code: string;
  runId: number;
};

export type WorkerOutboundMessage =
  | { type: "ready" }
  | { type: "load-error"; message: string }
  | { type: "stdout"; text: string }
  | { type: "stderr"; text: string }
  | { type: "done"; runId: number; ok: boolean; errorLine: number | null; errorMessage: string | null };
