import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { MessageBubble, type MessageRole } from './MessageBubble';
import { cn } from '../lib/cn';

export type MessageThreadMessage = {
  id: string;
  role: MessageRole;
  content: string;
  streaming?: boolean;
  timestamp?: string;
};

export type MessageThreadProps = {
  messages: MessageThreadMessage[];
  autoScroll?: boolean;
  maxHeight?: string | number;
  className?: string;
  style?: CSSProperties;
};

export function MessageThread({
  messages,
  autoScroll = true,
  maxHeight = '480px',
  className,
  style,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  return (
    <div
      className={cn('flex flex-col gap-[20px] overflow-y-auto rounded-md bg-background p-[16px]', className)}
      style={{
        maxHeight,
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-border) transparent',
        ...style,
      }}
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
          streaming={msg.streaming}
          timestamp={msg.timestamp}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
