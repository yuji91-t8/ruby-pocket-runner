import { useEffect, useRef } from "react";
import type { OutputChunk } from "../hooks/useRubyRunner";

interface OutputProps {
  chunks: OutputChunk[];
}

export function Output({ chunks }: OutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chunks]);

  return (
    <div className="output" ref={scrollRef}>
      {chunks.length === 0 ? (
        <p className="output-placeholder">Run を押すと実行結果がここに表示されます。</p>
      ) : (
        <pre className="output-pre">
          {chunks.map((chunk) => (
            <span key={chunk.id} className={`output-${chunk.stream}`}>
              {chunk.text}
            </span>
          ))}
        </pre>
      )}
    </div>
  );
}
