import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '../lib/cn';

export type StreamingTextProps = {
  /** Already-accumulated text to render; this component does not append chunks. */
  text: string;
  /** Shows the streaming caret after the current text. */
  streaming?: boolean;
  className?: string;
  style?: CSSProperties;
};

export type SimulatedStreamState = {
  text: string;
  streaming: boolean;
};

export function StreamingText({
  text,
  streaming = false,
  className,
  style,
}: StreamingTextProps) {
  return (
    <span
      className={cn(
        'whitespace-pre-wrap break-words font-[inherit] leading-[inherit] text-inherit',
        className,
      )}
      style={style}
    >
      {text}
      {streaming && (
        <span
          className="cd-streaming-text-caret ml-px inline-block h-[1em] w-0.5 bg-foreground align-text-bottom"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

/**
 * Reveals fullText over time in small chunks; speed is the interval in ms.
 */
export function useSimulatedStream(fullText: string, speed = 18): SimulatedStreamState {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setText('');
    indexRef.current = 0;
    setStreaming(true);

    const interval = setInterval(() => {
      if (indexRef.current >= fullText.length) {
        setStreaming(false);
        clearInterval(interval);
        return;
      }

      const chunkSize = Math.floor(Math.random() * 3) + 1;
      const next = fullText.slice(0, indexRef.current + chunkSize);
      setText(next);
      indexRef.current = Math.min(indexRef.current + chunkSize, fullText.length);
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  return { text, streaming };
}
