export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
}

export interface ChatState {
    currentRoomId: string | null;
    messages: Record<string, ChatMessage[]>;
    isLoading: boolean;
    error: string | null;
}
