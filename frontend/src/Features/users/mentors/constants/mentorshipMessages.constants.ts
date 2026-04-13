// ─── Mentorship Management Page — Message Constants ───────────────────────────

export const MentorshipMessages = {
    // ── Toast / API feedback ────────────────────────────────────────────────
    MENTOR_STARTED_SESSION: 'Mentor has started the session! You can join now.',
    MENTORSHIP_CONFIRMED: 'Mentorship confirmed! Proceed to payment.',
    MENTORSHIP_REJECTED: 'Mentorship request rejected.',
    SESSION_BOOKED: 'Session booked successfully',
    MENTORSHIP_COMPLETED: 'You have confirmed the completion of this mentorship!',
    RESCHEDULE_SENT: 'Reschedule request sent to mentor. They will propose a new time.',
    RESCHEDULE_ACCEPTED: 'New time accepted!',
    RESCHEDULE_DECLINED: 'Reschedule rejected and session cancelled',
    BOOKING_CANCELLED: 'Booking cancelled successfully',
    MENTORSHIP_CANCELLED: 'Mentorship cancelled successfully.',
    REVIEW_ERROR_FALLBACK: 'Failed to submit review',

    // ── Booking validation ──────────────────────────────────────────────────
    MENTOR_INFO_MISSING: 'Mentor information is missing',
    DATE_OR_SLOT_MISSING: 'Date or slot is not selected',
    CANNOT_BOOK_PAST_DATE: 'Cannot book sessions for past dates.',

    // ── Cancel session toast UI ─────────────────────────────────────────────
    CANCEL_SESSION_TITLE: 'Cancel Session',
    CANCEL_ACTION_UNDONE: 'Action cannot be undone',
    CANCEL_SESSION_CONFIRM_TEXT: 'Are you sure you want to cancel this session?',
    CANCEL_KEEP_BTN: 'Keep Session',
    CANCEL_CONFIRM_BTN: 'Yes, Cancel',

    // ── Page headings & labels ──────────────────────────────────────────────
    PAGE_TITLE: 'Mentorship Dashboard',
    STATUS_COMPLETED: 'Completed',
    STATUS_CANCELLED: 'Cancelled',

    // ── Session card labels ─────────────────────────────────────────────────
    SESSION_HAPPENING_NOW: 'Happening Now',
    SESSION_UPCOMING: 'Upcoming Session',
    SESSION_DEFAULT_TOPIC: 'Mentorship Session',
    SESSION_DATE_TBD: 'Date TBD',
    BTN_START_SESSION: 'Start Session',
    BTN_SESSION_EXPIRED: 'Session Expired',
    BTN_JOIN_SESSION: 'Join Session',
    BTN_WAITING_HOST: 'Waiting for Host...',

    // ── Mentor profile card ─────────────────────────────────────────────────
    YOUR_MENTOR_LABEL: 'Your Mentor',
    MENTOR_DEFAULT_EXPERTISE: 'Mentor',
    MENTOR_DEFAULT_NAME: 'Mentor',

    // ── Session usage card ──────────────────────────────────────────────────
    SESSION_USAGE_TITLE: 'Session Usage',
    SESSION_USAGE_SUBTITLE: 'Track your progress during this month',
    LABEL_TOTAL: 'Total',
    LABEL_USED: 'Used',
    LABEL_LEFT: 'Left',
    LABEL_PROGRESS: 'Progress',
    LABEL_PERCENT_COMPLETE: '% Complete',

    // ── Status action cards ─────────────────────────────────────────────────
    ACCEPTED_TITLE: 'Application Accepted!',
    ACCEPTED_BODY: 'The mentor has accepted your request.',
    ACCEPTED_SUGGESTED_DATE_PREFIX: 'Note: Suggested Start Date:',
    BTN_CONFIRM_PAY: 'Confirm & Pay',
    BTN_REJECT: 'Reject',

    PAYMENT_REQUIRED_TITLE: 'Payment Required',
    PAYMENT_REQUIRED_BODY: 'Please complete the payment to activate your mentorship.',
    PAYMENT_TOTAL_AMOUNT: 'Total Amount',
    BTN_PROCESSING: 'Processing...',
    BTN_PAY_NOW: 'Pay Now',

    // ── Booking calendar hint ───────────────────────────────────────────────
    SESSIONS_REMAINING_HINT: (count: number) =>
        `You have ${count} sessions remaining for this month.`,

    SCHEDULE_SESSION_TITLE: 'Schedule a Session',

    // ── Completion section ──────────────────────────────────────────────────
    COMPLETION_TITLE: 'Finish Mentorship?',
    COMPLETION_BODY:
        "If you've completed your sessions and goals, you can mark this mentorship as complete.",
    BTN_AWAITING_MENTOR: 'Awaiting Mentor Confirmation',
    BTN_CONFIRM_COMPLETION: 'Confirm Completion',

    // ── Recent sessions list ────────────────────────────────────────────────
    RECENT_SESSIONS_TITLE: 'Recent Sessions',
    NO_SESSIONS_TITLE: 'No sessions booked yet',
    NO_SESSIONS_HINT: 'Book your first session above',
    SESSION_FALLBACK_TOPIC: (idx: number) => `Session #${idx + 1}`,

    // ── Not found / loading states ──────────────────────────────────────────
    NOT_FOUND_TITLE: 'Mentorship not found',
    BTN_RETURN_HOME: 'Return Home',
    BTN_BACK_TO_HOME: 'Back to Home',

    // ── Rejected mentorship view ────────────────────────────────────────────
    REJECTED_TITLE: 'Request Rejected',
    REJECTED_BODY: 'The mentor has reviewed your request but decided not to proceed at this time.',
    REJECTED_REASON_LABEL: 'Reason provided',
    REJECTED_NO_REASON: 'No specific reason provided.',
    REJECTED_REAPPLY_LABEL: 'You can re-apply after',

    // ── Policy modal ────────────────────────────────────────────────────────
    POLICY_MODAL_TITLE: 'Mentorship Policy',
    POLICY_MODAL_SUBTITLE: 'Terms and guidelines for your sessions',
    POLICY_PERSONAL_GUIDANCE_TITLE: 'Personal Guidance',
    POLICY_PERSONAL_GUIDANCE_BODY:
        'Support for career, job applications, and emotional well-being.',
    POLICY_SCHEDULE_TITLE: 'Schedule & Duration',
    POLICY_SCHEDULE_BODY: (totalSessions: number) =>
        `${totalSessions} regular sessions on alternative days (30 mins each).`,
    POLICY_COMMUNICATION_TITLE: 'Communication Mode',
    POLICY_COMMUNICATION_BODY:
        'Session scheduling via tool with Video or Audio call preference.',
    POLICY_RESCHEDULE_TITLE: 'Rescheduling Policy',
    POLICY_RESCHEDULE_BODY:
        'Must request at least 6 hours before. Missed sessions require alternative allocation.',
    BTN_UNDERSTOOD: 'Understood',

    // ── Button / title misc ─────────────────────────────────────────────────
    BTN_CANCEL: 'Cancel',
    BTN_CHAT: 'Chat',
    BTN_POLICY: 'Policy',
};
