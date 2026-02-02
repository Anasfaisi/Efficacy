import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setConversations, setCurrentConversation } from '@/redux/slices/chatSlice';
import { chatApi } from '@/Services/chat.api';
import { useChatSocket } from '@/hooks/useChatSocket';
import MentorSidebar from '@/Features/mentors/layout/MentorSidebar';
import { Send, User as UserIcon, Menu, Image as ImageIcon, Mic, X } from 'lucide-react';
import type { Message } from '@/types/chat.types';



const MentorChatPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { conversations, currentConversation } = useAppSelector((state) => state.chat);
    const { currentUser } = useAppSelector((state) => state.auth);
    
    
    const { sendMessage, messages } = useChatSocket(currentConversation?._id);
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await chatApi.getConversations();
                console.log(data,"mentor chats page");
                dispatch(setConversations(data));
            } catch (error) {
                console.error("Failed to load chats", error);
            }
        };
        fetchChats();
    }, [dispatch]);

    const [inputText, setInputText] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const isCancelledRef = useRef<boolean>(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        sendMessage(inputText, 'text');
        setInputText('');
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        
        try {
            await chatApi.deleteMessage(messageId);
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const { url } = await chatApi.uploadFile(file);
            sendMessage(url, 'image');
        } catch (error) {
            console.error('Failed to upload image', error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            isCancelledRef.current = false;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const stream = mediaRecorder.stream; 
                stream.getTracks().forEach(track => track.stop());

                if (isCancelledRef.current) return;

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const file = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
                try {
                    setIsUploading(true);
                    const { url } = await chatApi.uploadFile(file);
                    sendMessage(url, 'audio');
                } catch (error) {
                    console.error('Failed to upload audio', error);
                } finally {
                    setIsUploading(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording', error);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            isCancelledRef.current = true;
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const renderMessageContent = (msg: Message) => {
        switch (msg.type) {
            case 'image':
                return (
                    <img 
                        src={msg.content} 
                        alt="Shared image" 
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.content, '_blank')}
                    />
                );
            case 'audio':
                return (
                    <audio controls className="max-w-full">
                        <source src={msg.content} type="audio/webm" />
                        <source src={msg.content} type="audio/mp3" />
                    </audio>
                );
            case 'text':
            default:
                return <p className="text-sm break-words">{msg.content}</p>;
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen overflow-hidden">
            <MentorSidebar />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden"> 
            
                <div className="flex-1 flex overflow-hidden relative border-t border-gray-200 transition-all duration-300 w-full">
                    
                    {/* Chat Sidebar (Conversation List) */}
                    <div className={`${isSidebarOpen ? 'w-full md:w-80 absolute md:relative z-20 h-full' : 'hidden'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                            {conversations.map((chat) => {
                                const otherUser = chat.participants.find(p => (p as any)._id !== currentUser?.id && (p as any)._id !== (currentUser as any)?._id) || chat.participants[0];
                                
                                return (
                                    <div 
                                        key={chat._id}
                                        onClick={() => {
                                            dispatch(setCurrentConversation(chat));
                                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                                        }}
                                        className={`p-4 hover:bg-purple-50 cursor-pointer transition-colors ${currentConversation?._id === chat._id ? 'bg-purple-50 border-r-4 border-purple-600' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {otherUser?.profilePic ? (
                                                    <img src={otherUser.profilePic} alt={otherUser.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon size={20} className="text-gray-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{otherUser?.name || 'Unknown User'}</h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {chat.lastMessage?.content || 'No messages yet'}
                                                </p>
                                            </div>
                                            {chat.updatedAt && (
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {new Date(chat.updatedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col bg-slate-50 relative w-full">
                         <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md md:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
                        >
                            <Menu size={20} />
                        </button>

                        {currentConversation ? (
                            <>
                                {/* Header */}
                                <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex items-center gap-3">
                                     <div className="w-8 md:hidden"></div>
                                     {(() => {
                                        const otherUser = currentConversation.participants.find(p => (p as any)._id !== currentUser?.id && (p as any)._id !== (currentUser as any)?._id);
                                        return (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                                    {otherUser?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{otherUser?.name}</h3>
                                                </div>
                                            </>
                                        )
                                    })()}
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.senderId === currentUser?.id || msg.senderId === (currentUser as any)?._id; 
                                            return (
                                            <div key={idx} className={`flex group ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className="relative">
                                                    <div 
                                                        className={`max-w-[70%] p-3 rounded-2xl ${
                                                            isMe 
                                                            ? 'bg-purple-600 text-white rounded-br-none' 
                                                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100'
                                                        }`}
                                                    >
                                                        {renderMessageContent(msg)}
                                                        <div className={`text-[10px] mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'} text-right`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </div>
                                                    </div>
                                                    {isMe && (
                                                        <button
                                                            onClick={() => handleDeleteMessage(msg._id)}
                                                            className="absolute top-1/2 -translate-y-1/2 -left-8 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Delete message"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-200">
                                     <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    <div className="flex gap-2 items-center">
                                         <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                            disabled={isUploading || isRecording}
                                        >
                                            <ImageIcon size={20} />
                                        </button>
                                        
                                        <div className="flex-1 relative">
                                            {isRecording ? (
                                                <div className="w-full bg-gray-100 text-red-500 rounded-xl px-4 py-3 flex items-center animate-pulse">
                                                    <span className="mr-2">●</span> Recording...
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={inputText}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                    placeholder="Type your message..."
                                                    className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 transition-all disabled:bg-gray-200"
                                                    disabled={isUploading}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                                                />
                                            )}
                                        </div>

                                        {inputText.trim() ? (
                                            <button 
                                                onClick={handleSend}
                                                disabled={!inputText.trim() || isUploading}
                                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                                            >
                                                <Send size={20} />
                                            </button>
                                        ) : (
                                            isRecording ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={cancelRecording}
                                                        className="p-3 bg-red-100 text-red-500 hover:bg-red-200 rounded-xl transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                    <button
                                                        onClick={stopRecording}
                                                        className="p-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-colors"
                                                        title="Send"
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={startRecording}
                                                    className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
                                                    disabled={isUploading}
                                                >
                                                    <Mic size={20} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>

                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Send size={32} className="opacity-20" />
                                </div>
                                <p>Select a conversation to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorChatPage;
