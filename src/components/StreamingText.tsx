import { useEffect, useRef, useState } from 'react';

export type StreamingTextProps = {
  text: string;
  streaming?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
      className={[
        'whitespace-pre-wrap break-words font-[inherit] leading-[inherit] text-inherit',
        className,
      ].filter(Boolean).join(' ')}
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
