// import React, { useState, useRef } from 'react';
// import { useAppSelector } from '@/redux/hooks';
// import { useChatSocket } from '@/hooks/useChatSocket';
// import MessageBubble from './MessageBubble';
// import { Image as ImageIcon, Mic, Send, X } from 'lucide-react';
// import { chatApi } from '@/Services/chat.api';

// interface ChatWindowProps {
//     roomId: string | null;
// }

// const ChatWindow: React.FC<ChatWindowProps> = ({ roomId }) => {
//     const [input, setInput] = useState('');
//     const [isRecording, setIsRecording] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
    
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const audioChunksRef = useRef<Blob[]>([]);
//     const isCancelledRef = useRef<boolean>(false);

//     const user = useAppSelector((state) => state.auth.currentUser);

//     const { sendMessage, messages } = useChatSocket(roomId || '');

//     if (!roomId) {
//         return (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//                 select a chat room to start chatting
//             </div>
//         );
//     }

//     const handleSend = () => {
//         if (input.trim()) {
//             sendMessage(input, 'text');
//             setInput('');
//         }
//     };

//     const handleDeleteMessage = async (messageId: string) => {
//         try {
//             await chatApi.deleteMessage(messageId);
//         } catch (error) {
//             console.error('Failed to delete message', error);
//         }
//     };

//     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         try {
//             setIsUploading(true);
//             const { url } = await chatApi.uploadFile(file);
//             sendMessage(url, 'image');
//         } catch (error) {
//             console.error('Failed to upload image', error);
//         } finally {
//             setIsUploading(false);
//             if (fileInputRef.current) fileInputRef.current.value = '';
//         }
//     };

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const mediaRecorder = new MediaRecorder(stream);
//             mediaRecorderRef.current = mediaRecorder;
//             audioChunksRef.current = [];
//             isCancelledRef.current = false;

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     audioChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.onstop = async () => {
//                 const stream = mediaRecorder.stream; 
//                 stream.getTracks().forEach(track => track.stop()); // Stop tracks immediately

//                 if (isCancelledRef.current) {
//                     return;
//                 }

//                 const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//                 const file = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
//                 try {
//                     setIsUploading(true);
//                     const { url } = await chatApi.uploadFile(file);
//                     sendMessage(url, 'audio');
//                 } catch (error) {
//                     console.error('Failed to upload audio', error);
//                 } finally {
//                     setIsUploading(false);
//                 }
//             };

//             mediaRecorder.start();
//             setIsRecording(true);
//         } catch (error) {
//             console.error('Failed to start recording', error);
//             alert('Could not access microphone');
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current && isRecording) {
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//         }
//     };

//     const cancelRecording = () => {
//         if (mediaRecorderRef.current && isRecording) {
//             isCancelledRef.current = true;
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//         }
//     };

//     return (
//         <div className="flex-1 flex flex-col bg-gray-50 h-full relative">
//             {/*==================chat message area===============*/}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map((msg) => (
//                     <MessageBubble
//                         key={msg._id || msg.createdAt}
//                         message={msg}
//                         isOwn={msg.senderId === user?.id}
//                         onDelete={handleDeleteMessage}
//                     // />
//                 ))}
//             </div>

//             {/*=============inputarea======*/}
//             <div className="p-3 border-t bg-white">
//                  <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                 />
                
//                 <div className="flex items-center gap-2">
//                     <button 
//                         onClick={() => fileInputRef.current?.click()}
//                         className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
//                         disabled={isUploading || isRecording}
//                     >
//                         <ImageIcon size={20} />
//                     </button>

//                     <div className="flex-1 relative">
//                         {isRecording ? (
//                              <div className="w-full border rounded-full px-4 py-2 bg-gray-100 text-red-500 flex items-center animate-pulse">
//                                 <span className="mr-2">●</span> Recording...
//                             </div>
//                         ) : (
//                             <input
//                                 type="text"
//                                 className="w-full border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
//                                 placeholder="Type a message.."
//                                 value={input}
//                                 onChange={(e) => setInput(e.target.value)}
//                                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                                 disabled={isUploading}
//                             />
//                         )}
//                     </div>
                
//                     {input.trim() ? (
//                         <button
//                             onClick={handleSend}
//                             className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//                         >
//                             <Send size={20} />
//                         </button>
//                     ) : (
//                          isRecording ? (
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={cancelRecording}
//                                     className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
//                                     title="Cancel"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                                 <button
//                                     onClick={stopRecording}
//                                     className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//                                     title="Send"
//                                 >
//                                     <Send size={20} />
//                                 </button>
//                             </div>
//                         ) : (
//                             <button
//                                 onClick={startRecording}
//                                 className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
//                                 disabled={isUploading}
//                             >
//                                 <Mic size={20} />
//                             </button>
//                         )
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default ChatWindow;
