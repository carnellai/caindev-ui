import { useId, useState } from 'react';
import { StreamingText } from './StreamingText';

export type ThinkingBlockProps = {
  content: string;
  streaming?: boolean;
  defaultOpen?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="cd-thinking-block-chevron shrink-0 transition-transform duration-150 ease-[ease]"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PulsingDot() {
  return (
    <span className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="cd-thinking-block-dot h-1 w-1 rounded-full bg-foreground-subtle"
        />
      ))}
    </span>
  );
}

export function ThinkingBlock({
  content,
  streaming = false,
  defaultOpen = false,
  label = 'Thinking',
  className,
  style,
}: ThinkingBlockProps) {
  const [open, setOpen] = useState(defaultOpen || streaming);
  const contentId = useId();

  return (
    <div
      className={['overflow-hidden rounded-[8px] border border-border bg-background-subtle', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2.5 text-left text-[0.8125rem] font-medium text-foreground-muted"
      >
        <ChevronIcon open={open} />
        <span>{label}</span>
        {streaming && <PulsingDot />}
        {!streaming && (
          <span className="ml-auto text-[0.6875rem] text-foreground-subtle">
            {content.split(' ').length} words
          </span>
        )}
      </button>

      {open && (
        <div
          id={contentId}
          className="border-t border-border px-3 pb-3"
        >
          <p className="m-0 mt-2.5 whitespace-pre-wrap break-words text-[0.8125rem] italic leading-[1.65] text-foreground-muted">
            {streaming ? (
              <StreamingText text={content} streaming={streaming} />
            ) : content}
          </p>
        </div>
      )}
    </div>
  );
}
