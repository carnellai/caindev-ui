import { useState } from 'react';

export type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  style?: React.CSSProperties;
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
      className={['overflow-hidden rounded-[8px] border border-border bg-background', className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="flex items-center justify-between border-b border-border bg-background-elevated px-3 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="font-mono text-xs text-foreground-muted">
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
          className={[
            'flex cursor-pointer items-center gap-[5px] rounded-[5px] border border-border bg-transparent px-2 py-[3px] text-[0.6875rem] transition-colors duration-150',
            copied ? 'text-emerald-400' : 'text-foreground-muted',
          ].join(' ')}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <pre className="m-0 px-4 py-3.5 font-mono text-[0.8125rem] leading-[1.65] text-foreground-muted">
          {showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="min-w-[2ch] select-none pr-4 text-right text-xs text-foreground-subtle">
                      {i + 1}
                    </td>
                    <td className="w-full">
                      <code>{line}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
