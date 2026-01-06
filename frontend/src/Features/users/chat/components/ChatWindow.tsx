import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useChatSocket } from '@/hooks/useChatSocket';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
    roomId: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ roomId }) => {
    const [input, setInput] = useState('');

    const user = useAppSelector((state) => state.auth.user);

    const messages = useAppSelector((state) =>
        roomId ? state.chat.messages[roomId] || [] : [],
    );

    const send = useChatSocket(roomId || '');
    if (!roomId) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                select a chat room to start chatting
            </div>
        );
    }

    const handleSend = () => {
        console.log('handle send is working');
        if (input.trim()) {
            send(input);
            setInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            {/*==================chat message area===============*/}
            <div className="flex-1 overflow-7-auto p-4">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id || msg.createdAt}
                        message={msg}
                        isOwn={msg.senderId === user?.id}
                    />
                ))}
            </div>

            {/*=============inputarea======*/}
            <div className="p-3 border-t flex gap-2 bg-white">
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Type a message.."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />

                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
export default ChatWindow;
