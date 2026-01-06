import React from 'react';
import type { ChatMessage } from '@/types/chat.types';

interface MessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
    return (
        <div className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
            >
                {!isOwn && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                        {message.senderName}
                    </p>
                )}

                <p className="break-words">{message.message}</p>

                <span className="block text-xs text-gray-500 text-right mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </div>
    );
};
export default MessageBubble;
