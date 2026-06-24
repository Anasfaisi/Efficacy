import {
    ConversationEntity,
    ParticipantEntity,
} from '@/entity/conversation.entity';
import { IConversation } from '@/models/conversation.model';
import { Types } from 'mongoose';

export class ConversationMapper {
    static toEntity(doc: IConversation): ConversationEntity {
        const participants = doc.participants.map((p) => {
            // p._id could be a raw ObjectId or a populated User/Mentor object
            const id = (p._id as any)?._id?.toString() || p._id.toString();
            const name = (p._id as any)?.name;
            const profilePic = (p._id as any)?.profilePic;
            const email = (p._id as any)?.email;

            return new ParticipantEntity(
                id,
                p.onModel as 'Users' | 'Mentors',
                name,
                profilePic,
                email
            );
        });

        return new ConversationEntity(
            (doc._id as Types.ObjectId).toString(),
            participants,
            doc.isActive,
            doc.lastMessage?.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }
}
