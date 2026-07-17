"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedMentorshipResponseDto = exports.VerifyPaymentDto = exports.MentorshipFeedbackDto = exports.RescheduleSessionDto = exports.BookSessionDto = exports.ConfirmSuggestionDto = exports.RespondToMentorshipDto = exports.CreateMentorshipRequestDto = void 0;
class CreateMentorshipRequestDto {
    mentorId;
    sessions;
    proposedStartDate;
    constructor(mentorId, sessions, proposedStartDate) {
        this.mentorId = mentorId;
        this.sessions = sessions;
        this.proposedStartDate = proposedStartDate;
    }
}
exports.CreateMentorshipRequestDto = CreateMentorshipRequestDto;
class RespondToMentorshipDto {
    status;
    suggestedStartDate;
    reason;
    constructor(status, suggestedStartDate, reason) {
        this.status = status;
        this.suggestedStartDate = suggestedStartDate;
        this.reason = reason;
    }
}
exports.RespondToMentorshipDto = RespondToMentorshipDto;
class ConfirmSuggestionDto {
    confirm;
    constructor(confirm) {
        this.confirm = confirm;
    }
}
exports.ConfirmSuggestionDto = ConfirmSuggestionDto;
class BookSessionDto {
    date;
    constructor(date) {
        this.date = date;
    }
}
exports.BookSessionDto = BookSessionDto;
class RescheduleSessionDto {
    sessionId;
    newDate;
    constructor(sessionId, newDate) {
        this.sessionId = sessionId;
        this.newDate = newDate;
    }
}
exports.RescheduleSessionDto = RescheduleSessionDto;
class MentorshipFeedbackDto {
    rating;
    comment;
    constructor(rating, comment) {
        this.rating = rating;
        this.comment = comment;
    }
}
exports.MentorshipFeedbackDto = MentorshipFeedbackDto;
class VerifyPaymentDto {
    paymentId;
    constructor(paymentId) {
        this.paymentId = paymentId;
    }
}
exports.VerifyPaymentDto = VerifyPaymentDto;
class PaginatedMentorshipResponseDto {
    mentorships;
    totalCount;
    totalPages;
    currentPage;
    constructor(mentorships, totalCount, totalPages, currentPage) {
        this.mentorships = mentorships;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
exports.PaginatedMentorshipResponseDto = PaginatedMentorshipResponseDto;
//# sourceMappingURL=mentorship.dto.js.map