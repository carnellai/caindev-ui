import { useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '../lib/cn';

export type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  style?: CSSProperties;
  className?: string;
};

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="9" height="9" rx="1.5" />
      <path d="M3 10V3a1 1 0 0 1 1-1h7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l3.5 3.5L13 4" />
    </svg>
  );
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  style,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const lines = code.split('\n');

  return (
    <div
      className={cn('overflow-hidden rounded-md border border-border-strong bg-background shadow-card', className)}
      style={style}
    >
      <div className="flex items-center justify-between gap-[12px] border-b border-border bg-background-elevated px-[14px] py-[10px]">
        <div className="flex min-w-[0] items-center gap-[8px]">
          {filename && (
            <span className="truncate font-mono text-xs font-medium text-foreground-muted">
              {filename}
            </span>
          )}
          {language && (
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-foreground-subtle">
              {language}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={copied ? 'Code copied' : 'Copy code'}
          onClick={handleCopy}
          className={cn(
            'flex cursor-pointer items-center gap-[5px] rounded-sm border border-border bg-transparent px-[8px] py-[3px] text-[0.6875rem] transition-colors duration-150',
            copied ? 'text-success' : 'text-foreground-muted',
          )}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto">
        {showLineNumbers ? (
          <div className="px-[16px] py-[14px] font-mono text-[0.8125rem] leading-[1.65] text-foreground-muted">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="min-w-[2ch] select-none pr-[16px] text-right text-xs text-foreground-subtle">
                  {i + 1}
                </span>
                <code className="w-full whitespace-pre">{line || ' '}</code>
              </div>
            ))}
          </div>
        ) : (
          <pre className="m-0 px-[16px] py-[14px] font-mono text-[0.8125rem] leading-[1.65] text-foreground-muted">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
