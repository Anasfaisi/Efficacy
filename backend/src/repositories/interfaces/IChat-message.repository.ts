import { IChatMessage } from '@/models/Chat-message.model';

export interface IChatMessageRepository {
    save(message: IChatMessage): Promise<IChatMessage>;
    getLastMessage(roomId: string, limit: number): Promise<IChatMessage[]>;
}
