import React from 'react';
import ChatRoomList from '@/Features/users/chat/components/ChatRoomLIst';
import ChatWindow from '@/Features/users/chat/components/ChatWindow';
import { useAppSelector } from '@/redux/hooks';

const rooms = [
  { id: 'math101', name: 'Math 101' },
  { id: 'physice', name: 'Physics study group' },
  { id: 'general', name: 'General chat' },
];

const ChatPage: React.FC = () => {
  const currentRoomId = useAppSelector((state) => state.chat.currentRoomId);
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatRoomList rooms={rooms} />
      <ChatWindow roomId={currentRoomId} />
    </div>
  );
};

export default ChatPage;
