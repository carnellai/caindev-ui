import { StreamingText } from './StreamingText';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageBubbleProps = {
  role: MessageRole;
  content: string;
  streaming?: boolean;
  avatar?: ReactNode;
  timestamp?: string;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

// Chat bubbles use asymmetric radii for the tail shape; this intentionally does not follow the global radius scale.
const roleClasses: Record<MessageRole, string> = {
  user: 'self-end max-w-[80%] rounded-[12px_12px_2px_12px] border border-border bg-background-subtle px-3.5 py-2.5',
  assistant: 'self-start max-w-[85%] rounded-none border-0 bg-transparent p-0',
  system: 'self-center max-w-[90%] rounded-md border border-accent/20 bg-accent-muted px-3.5 py-2.5',
};

function UserAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background-subtle">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--color-foreground-muted)">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 9a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z" />
      </svg>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent">
      <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
        <path d="M2 17 L8 7 L14 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 17 L15 10 L20 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      </svg>
    </div>
  );
}

export function MessageBubble({
  role,
  content,
  streaming = false,
  avatar,
  timestamp,
  actions,
  className,
  style,
}: MessageBubbleProps) {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn('flex w-full items-start gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row', className)}
      style={style}
    >
      {isUser && (avatar ?? <UserAvatar />)}
      {isAssistant && (avatar ?? <AssistantAvatar />)}

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className={roleClasses[role]}>
          <p className="m-0 whitespace-pre-wrap break-words text-[0.9375rem] leading-[1.65] text-foreground">
            {streaming ? (
              <StreamingText text={content} streaming={streaming} />
            ) : content}
          </p>
        </div>

        {(timestamp || actions) && (
          <div className={cn('flex items-center gap-2', isUser ? 'justify-end pl-0' : 'justify-start pl-0.5')}>
            {timestamp && (
              <span className="text-[0.6875rem] text-foreground-subtle tabular-nums">
                {timestamp}
              </span>
            )}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
