import { useState } from "react";
import { Editor } from "./components/Editor";
import { Output } from "./components/Output";
import { StatusBadge } from "./components/StatusBadge";
import { useRubyRunner } from "./hooks/useRubyRunner";
import { INITIAL_CODE } from "./lib/initialCode";
import "./App.css";

function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [copied, setCopied] = useState(false);
  const { status, output, run, clearOutput, reload } = useRubyRunner();

  const isBusy = status === "loading" || status === "running";

  const handleRun = () => run(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ruby Pocket Runner</h1>
        <StatusBadge status={status} />
      </header>

      <div className="app-body">
        <section className="panel editor-panel">
          <div className="panel-tabs">
            <span className="tab tab-active">Main.rb</span>
            <div className="panel-actions">
              <button type="button" className="btn btn-ghost" onClick={handleCopy}>
                {copied ? "コピーしました" : "コピー"}
              </button>
            </div>
          </div>
          <div className="editor-wrap">
            <Editor value={code} onChange={setCode} />
          </div>
        </section>

        <section className="panel output-panel">
          <div className="panel-tabs">
            <span className="tab tab-active">Output</span>
            <div className="panel-actions">
              <button type="button" className="btn btn-ghost" onClick={clearOutput}>
                クリア
              </button>
              {status === "load-error" && (
                <button type="button" className="btn btn-ghost" onClick={reload}>
                  再読み込み
                </button>
              )}
            </div>
          </div>
          <Output chunks={output} status={status} />
        </section>
      </div>

      <footer className="app-footer">
        <button type="button" className="btn btn-run" onClick={handleRun} disabled={isBusy}>
          {status === "running" ? "実行中…" : status === "loading" ? "読み込み中…" : "▶ Run"}
        </button>
      </footer>
    </div>
  );
}

export default App;
