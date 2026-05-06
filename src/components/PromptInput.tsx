import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type PromptInputProps = {
  /** Controlled prompt text. Uncontrolled inputs clear themselves after submit. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Receives trimmed text when Enter or the send button submits. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Shows the stop action and disables editing while generation is active. */
  loading?: boolean;
  /** Called by the stop button while loading. */
  onStop?: () => void;
  maxRows?: number;
  /** Custom action controls rendered on the left side of the footer. */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8H2M14 8l-5 5M14 8l-5-5" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="10" height="10" rx="2" />
    </svg>
  );
}

export function PromptInput({
  value: controlledValue,
  onValueChange,
  onSubmit,
  placeholder = 'Message…',
  disabled = false,
  loading = false,
  onStop,
  maxRows = 8,
  actions,
  className,
  style,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const lineHeight = 24;
    const maxHeight = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, maxRows]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (controlledValue === undefined) setInternalValue(v);
    onValueChange?.(v);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !loading) {
        onSubmit?.(value.trim());
        if (controlledValue === undefined) setInternalValue('');
      }
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !disabled && !loading) {
      onSubmit?.(value.trim());
      if (controlledValue === undefined) setInternalValue('');
    }
  };

  const canSubmit = value.trim().length > 0 && !disabled;

  return (
    <div
      className={cn(
        'flex flex-col rounded-md border border-border-strong bg-background-elevated shadow-highlight-inset transition-[border-color] duration-150',
        className,
      )}
      style={style}
    >
      <textarea
        ref={textareaRef}
        aria-label="Prompt"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={1}
        className="box-border w-full resize-none overflow-y-hidden border-0 bg-transparent px-3.5 pb-1 pt-3 text-[0.9375rem] leading-6 text-foreground outline-none"
      />

      <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1.5">
        <div className="flex items-center gap-1">
          {actions}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[0.6875rem] text-foreground-subtle">
            {loading ? '' : 'Enter to send · Shift+Enter for newline'}
          </span>

          {loading ? (
            <button
              type="button"
              aria-label="Stop generation"
              onClick={onStop}
              disabled={disabled || !onStop}
              className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border-0 bg-foreground text-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Send prompt"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                'flex h-[30px] w-[30px] items-center justify-center rounded-md border-0 transition-[background,color] duration-150',
                canSubmit ? 'cursor-pointer bg-accent text-accent-foreground' : 'cursor-not-allowed bg-background-subtle text-foreground-subtle',
              )}
            >
              <SendIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
