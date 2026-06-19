import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { oneDark } from "@codemirror/theme-one-dark";

const rubyLanguage = StreamLanguage.define(ruby);

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={oneDark}
      extensions={[rubyLanguage]}
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
