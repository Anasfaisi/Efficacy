export class ParticipantEntity {
    constructor(
        public id: string,
        public onModel: 'Users' | 'Mentors',
        public name?: string,
        public profilePic?: string,
        public email?: string
    ) {}
}

export class ConversationEntity {
    constructor(
        public id: string,
        public participants: ParticipantEntity[],
        public isActive: boolean,
        public lastMessage?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
}
