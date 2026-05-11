import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, UIEvent } from 'react';
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
  /** Custom renderer for each message. When provided, replaces the default MessageBubble. */
  renderMessage?: (message: MessageThreadMessage, index: number) => ReactNode;
};

export function MessageThread({
  messages,
  autoScroll = true,
  maxHeight = '480px',
  className,
  style,
  renderMessage,
}: MessageThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const previousMessagesRef = useRef<{ count: number; lastKey: string } | null>(null);
  const lastMessage = messages[messages.length - 1];
  const lastMessageKey = lastMessage
    ? `${lastMessage.id}\n${lastMessage.content}\n${lastMessage.streaming ? 'streaming' : 'complete'}`
    : '';

  function isNearBottom(element: HTMLDivElement) {
    return element.scrollHeight - element.scrollTop - element.clientHeight <= 48;
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    isNearBottomRef.current = isNearBottom(event.currentTarget);
  }

  useEffect(() => {
    const container = containerRef.current;
    const previousMessages = previousMessagesRef.current;
    const currentMessages = { count: messages.length, lastKey: lastMessageKey };

    previousMessagesRef.current = currentMessages;

    if (!autoScroll || !container) {
      return;
    }

    if (previousMessages && !isNearBottomRef.current) {
      return;
    }

    const didAppendMessage = previousMessages ? messages.length > previousMessages.count : false;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: didAppendMessage ? 'smooth' : 'auto',
    });
    isNearBottomRef.current = true;
  }, [autoScroll, messages.length, lastMessageKey]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      className={cn('flex flex-col gap-[20px] overflow-y-auto rounded-md bg-background p-[16px]', className)}
      style={{
        maxHeight,
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-border) transparent',
        ...style,
      }}
    >
      {messages.map((msg, index) =>
        renderMessage ? (
          renderMessage(msg, index)
        ) : (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            streaming={msg.streaming}
            timestamp={msg.timestamp}
          />
        ),
      )}
    </div>
  );
}
