import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent, KeyboardEvent, MutableRefObject, ReactNode, Ref } from 'react';
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
  'aria-describedby'?: string;
  ref?: Ref<HTMLTextAreaElement>;
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
  'aria-describedby': ariaDescribedBy,
  ref,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const keyboardHintId = useId();
  const describedBy = [ariaDescribedBy, keyboardHintId].filter(Boolean).join(' ');

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
        'flex flex-col overflow-hidden rounded-md border border-border bg-background-elevated shadow-card transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent',
        className,
      )}
      style={style}
    >
      <textarea
        ref={(el) => {
          (textareaRef as MutableRefObject<HTMLTextAreaElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref != null) (ref as MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }}
        aria-label="Prompt"
        aria-describedby={describedBy}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={1}
        className="box-border font-[inherit] w-full resize-none overflow-y-hidden border-0 bg-transparent px-[16px] pb-[8px] pt-[14px] text-[0.9375rem] leading-[1.6] text-foreground outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed disabled:text-foreground-subtle"
      />

      <div className="flex items-center justify-between gap-[12px] border-t border-border bg-background-subtle px-[10px] py-[10px]">
        <div className="flex min-w-[0] items-center gap-[6px]">
          {actions}
        </div>

        <div className="flex shrink-0 items-center gap-[8px]">
          <span id={keyboardHintId} className="text-[0.6875rem] text-foreground-subtle">
            {loading ? '' : 'Enter to send · Shift+Enter for newline'}
          </span>

          {loading ? (
            <button
              type="button"
              aria-label="Stop generation"
              onClick={onStop}
              disabled={disabled || !onStop}
              className="box-border flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-md border border-transparent bg-foreground text-background shadow-none outline-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
                'box-border flex h-[32px] w-[32px] items-center justify-center rounded-md border outline-none transition-[background,border-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                canSubmit ? 'cursor-pointer border-transparent bg-accent text-accent-foreground shadow-none hover:bg-accent-hover' : 'cursor-not-allowed border-border bg-surface-control-disabled text-foreground-subtle',
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
