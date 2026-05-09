import { useEffect, useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { StreamingText } from './StreamingText';
import { cn } from '../lib/cn';

export type ThinkingBlockProps = {
  content: string;
  streaming?: boolean;
  defaultOpen?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
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
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (streaming) {
      setOpen(true);
    }
  }, [streaming]);

  return (
    <div
      className={cn('overflow-hidden rounded-md border border-border bg-background-elevated shadow-card', className)}
      style={style}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-[8px] border-0 bg-background-subtle px-[14px] py-[11px] text-left text-[0.8125rem] font-medium text-foreground-muted outline-none hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
      >
        <ChevronIcon open={open} />
        <span>{label}</span>
        {streaming && <PulsingDot />}
        {!streaming && (
          <span className="ml-auto text-[0.6875rem] text-foreground-subtle">
            {wordCount} words
          </span>
        )}
      </button>

      {open && (
        <div
          id={contentId}
          className="border-t border-border px-[14px] pb-[14px]"
        >
          <p className="m-0 mt-[12px] whitespace-pre-wrap break-words text-[0.8125rem] italic leading-[1.65] text-foreground-muted">
            {streaming ? (
              <StreamingText text={content} streaming={streaming} />
            ) : content}
          </p>
        </div>
      )}
    </div>
  );
}
