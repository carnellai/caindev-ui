export type StreamingTextProps = {
  text: string;
  streaming?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
