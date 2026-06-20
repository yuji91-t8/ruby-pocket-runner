import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { oneDark } from "@codemirror/theme-one-dark";
import { linter, lintGutter } from "@codemirror/lint";
import type { Diagnostic } from "@codemirror/lint";

const rubyLanguage = StreamLanguage.define(ruby);

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  errorLine: number | null;
  errorMessage: string | null;
}

export function Editor({ value, onChange, errorLine, errorMessage }: EditorProps) {
  const errorLinter = linter(
    (view) => {
      if (errorLine === null) return [];

      const { doc } = view.state;
      const lineNumber = Math.min(Math.max(errorLine, 1), doc.lines);
      const line = doc.line(lineNumber);

      return [
        {
          from: line.from,
          to: line.to,
          severity: "error",
          message: errorMessage ?? "構文エラーが発生しました",
        } satisfies Diagnostic,
      ];
    },
    { delay: 0 },
  );

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={oneDark}
      extensions={[rubyLanguage, errorLinter, lintGutter()]}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        autocompletion: false,
        closeBrackets: true,
        highlightActiveLine: true,
      }}
      onChange={onChange}
      style={{ height: "100%", fontSize: "14px" }}
    />
  );
}
