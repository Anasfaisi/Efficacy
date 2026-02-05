export class CreateMentorshipRequestDto {
    constructor(
        public mentorId: string,
        public sessions: number,
        public proposedStartDate?: Date
    ) {}
}

export class RespondToMentorshipDto {
    constructor(
        public status: 'mentor_accepted' | 'rejected',
        public suggestedStartDate?: Date,
        public reason?: string
    ) {}
}

export class ConfirmSuggestionDto {
    constructor(public confirm: boolean) {}
}

export class BookSessionDto {
    constructor(public date: Date) {}
}

export class RescheduleSessionDto {
    constructor(
        public sessionId: string,
        public newDate: Date
    ) {}
}

export class MentorshipFeedbackDto {
    constructor(
        public rating: number,
        public comment: string
    ) {}
}

export class VerifyPaymentDto {
    constructor(public paymentId: string) {}
}

export class PaginatedMentorshipResponseDto {
    constructor(
        public mentorships: any[], // Replacing any is better but let's see
        public totalCount: number,
        public totalPages: number,
        public currentPage: number
    ) {}
}
