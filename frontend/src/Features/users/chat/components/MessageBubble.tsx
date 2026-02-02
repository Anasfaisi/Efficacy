import React from 'react';
import type { Message } from '@/types/chat.types';
import { Trash } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    onDelete?: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, onDelete }) => {
    const renderContent = () => {
        switch (message.type) {
            case 'image':
                return (
                    <img 
                        src={message.content} 
                        alt="Shared image" 
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.content, '_blank')}
                    />
                );
            case 'audio':
                return (
                    <audio controls className="max-w-[250px]">
                        <source src={message.content} type="audio/webm" />
                        <source src={message.content} type="audio/mp3" /> {/* Fallback if needed */}
                        Your browser does not support the audio element.
                    </audio>
                );
            case 'text':
            default:
                return <p className="break-words">{message.content}</p>;
        }
    };

    return (
        <div className={`flex mb-2 group ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className="relative">
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

                    {renderContent()}

                    <span className={`block text-xs text-right mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
                 {isOwn && onDelete && (
                    <button
                        onClick={() => onDelete(message._id)}
                        className="absolute top-1/2 -translate-y-1/2 -left-8 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete message"
                    >
                        <Trash size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};
export default MessageBubble;
