import type { RunStatus } from "../hooks/useRubyRunner";

const LABEL: Record<RunStatus, string> = {
  loading: "Rubyランタイムを読み込み中…",
  ready: "準備完了",
  running: "実行中…",
  "load-error": "読み込みエラー",
  error: "実行時エラー",
};

export function StatusBadge({ status }: { status: RunStatus }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="status-dot" />
      {LABEL[status]}
    </span>
  );
}
