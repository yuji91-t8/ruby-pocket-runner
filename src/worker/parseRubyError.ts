export interface RubyErrorInfo {
  line: number | null;
  isSyntaxError: boolean;
  message: string;
}

// ruby.wasm error messages look like one of:
//   -e:in `eval': eval:3: syntax error, unexpected end-of-input (SyntaxError)
//   -e:in `eval': eval:1: unterminated string meets end of file
//   puts 'unterminated
//                      ^
//    (SyntaxError)
//   eval:2:in `<main>': undefined method `foo' for nil (NoMethodError)
const LINE_PATTERN = /eval:(\d+):(?:in `[^`']*':)?\s*([^\n]*)/;
const ERROR_CLASS_SUFFIX = /\s*\(\w+Error\)\s*$/;

export function parseRubyError(message: string): RubyErrorInfo {
  const match = message.match(LINE_PATTERN);
  const line = match ? Number(match[1]) : null;
  const isSyntaxError = /\(SyntaxError\)/.test(message);
  const summary = match ? match[2].replace(ERROR_CLASS_SUFFIX, "").trim() : message.trim();

  return { line, isSyntaxError, message: summary };
}
