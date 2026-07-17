"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStatus = exports.MentorshipStatus = void 0;
var MentorshipStatus;
(function (MentorshipStatus) {
    MentorshipStatus["PENDING"] = "pending";
    MentorshipStatus["MENTOR_ACCEPTED"] = "mentor_accepted";
    MentorshipStatus["USER_CONFIRMED"] = "user_confirmed";
    MentorshipStatus["PAYMENT_PENDING"] = "payment_pending";
    MentorshipStatus["ACTIVE"] = "active";
    MentorshipStatus["COMPLETED"] = "completed";
    MentorshipStatus["REJECTED"] = "rejected";
    MentorshipStatus["CANCELLED"] = "cancelled";
})(MentorshipStatus || (exports.MentorshipStatus = MentorshipStatus = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["PENDING"] = "pending";
    SessionStatus["BOOKED"] = "booked";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["RESCHEDULE_REQUESTED"] = "reschedule_requested";
    SessionStatus["CANCELLED"] = "cancelled";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
//# sourceMappingURL=mentorship.types.js.map