import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentRoom } from '@/redux/slices/chatSlice';

interface ChatRoomListProps {
  rooms: { id: string; name: string }[];
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ rooms }) => {
  const dispatch = useAppDispatch();
  const currentRoomId = useAppSelector((state) => state.chat.currentRoomId);

  return (
    <>
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold mb-2">Subjects</h2>
        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`p-2 cursor-pointer rounded ${
                currentRoomId === room.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => dispatch(setCurrentRoom(room.id))}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default ChatRoomList;
