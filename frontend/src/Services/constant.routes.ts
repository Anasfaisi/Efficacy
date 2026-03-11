export const UserRoutes = {
    BASE: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register/init',
    VERIFY_OTP: '/register/verify',
    RESEND_OTP: '/register/resend-otp',
    FORGET_PASSWORD :'/forgot-password/init',
    RESET_PASSWORD :'/forgot-password/verify',
    NOTIFICATIONS: '/notifications',
    MARK_ALL_NOTIFICATIONS_AS_READ: '/notifications/mark-all-read',
    MARK_NOTIFICATION_AS_READ: (notificationId:string) => `/notifications/${notificationId}/mark-read`,
    UPDATE_PROFILE_BASIC: (userId:string)=>`/profile/${userId}`,
    UPDATE_PROFILE_PICTURE :(userId:string)=>`/profile/picture/${userId}`,
    FETCH_CURRENT_USER: (userId : string)=>`/me/${userId}`,    
}

const MENTOR_BASE = '/mentor';
export const MentorRoutes = {
    BASE: MENTOR_BASE,
    REGISTER: `${MENTOR_BASE}/register/init`,
    MENTOR_APPLICATION_INIT: `${MENTOR_BASE}/application/init`,
    BASIC_MENTOR_PROFILE_BASIC: `${MENTOR_BASE}/profile/basic-info`,
    MEDIA_MENTOR_PROFILE_MEDIA: `${MENTOR_BASE}/profile/media`,
    ARRAY_MENTOR_PROFILE_ARRAY: `${MENTOR_BASE}/profile/array`,
    ACTIVATE_MENTOR: `${MENTOR_BASE}/activate`,
    MENTOR_PROFILE: `${MENTOR_BASE}/profile`,
    APPROVED_MENTORS_LIST: `${MENTOR_BASE}/list/approved`,
    VERIFY_OTP: `${MENTOR_BASE}/register/verify`,
    MENTOR_RESEND_OTP: `${MENTOR_BASE}/resend-otp`,
    MENTOR_FORGOT_PASSWORD: `${MENTOR_BASE}/forgot-password`,
    MENTOR_RESET_PASSWORD: `${MENTOR_BASE}/reset-password`,
    MENTOR_NOTIFICATIONS: `${MENTOR_BASE}/notifications`,
    MENTOR_MARK_ALL_NOTIFICATION_AS_READ: `${MENTOR_BASE}/notifications/mark-all-read`,

    MENTOR_MARK_NOTIFICATION_AS_READ: (notificationId: string) =>
        `${MENTOR_BASE}/notifications/${notificationId}/mark-read`,
    FETCH_MENTOR: (mentorId: string) => `${MENTOR_BASE}/${mentorId}`,
};

const ADMIN_BASE = '/admin';
export const AdminRoutes = {
    BASE: ADMIN_BASE,
    ADMINLOGIN: `${ADMIN_BASE}/login`,
    MENTOR_APPLICATIONS: `${ADMIN_BASE}/mentors/applications`,
    MENTOR_APPLICATIONS_ID: `${ADMIN_BASE}/mentors/applications`,
    MENTORS: `${ADMIN_BASE}/mentors`,
    USERS: `${ADMIN_BASE}/users`,
    NOTIFICATIONS_MARK_ALL_READ: `${ADMIN_BASE}/notifications/mark-all-read`,
    REVENUE: `${ADMIN_BASE}/revenue`,
    TRANSACTIONS: `${ADMIN_BASE}/transactions`,
    DASHBOARD_STATS: `${ADMIN_BASE}/dashboard-stats`,
    NOTIFICATIONS: `${ADMIN_BASE}/notifications`,
    USERS_STATUS: (userId: string) => `${ADMIN_BASE}/users/${userId}/status`,
    NOTIFICATION_MARK_READ: (notificationId: string) =>
        `${ADMIN_BASE}/notification/${notificationId}/mark-read`,
    MENTORS_ID: (mentorId: string) => `${ADMIN_BASE}/mentors/${mentorId}`,
    MENTORS_STATUS: (mentorId: string) => `${ADMIN_BASE}/mentors/${mentorId}/status`,
    MENTOR_APPLICATION_APPROVE: (applicationId: string) =>
        `${ADMIN_BASE}/mentors/applications/${applicationId}`,
    MENTOR_APPLICATION_REJECT: (applicationId: string) =>
        `${ADMIN_BASE}/mentors/applications/${applicationId}`,
    MENTOR_APPLICATION_BY_ID: (applicationId: string) =>
        `${ADMIN_BASE}/mentors/applications/${applicationId}`,
    MENTOR_APPLICATIONS_REQUEST_CHANGES: (applicationId: string) =>
        `${ADMIN_BASE}/mentors/applications/${applicationId}/request-changes`,
};

const CHAT_BASE = '/chat';
export const ChatRoutes = {
    BASE: CHAT_BASE,
    INITIATE: `${CHAT_BASE}/initiate`,
    MY_CONVERSATION: `${CHAT_BASE}/my-conversations`,
    MESSAGES: `${CHAT_BASE}/messages`,
    UPLOAD: `${CHAT_BASE}/upload`,
    DELETE_MESSAGE: (messageId: string) => `${CHAT_BASE}/messages/${messageId}`,
};

const MENTORSHIP_BASE = '/mentorship';
export const MentorshipRoutes = {
    BASE: MENTORSHIP_BASE,
    CREATE_REQUEST: `${MENTORSHIP_BASE}/request`,
    GET_MENTOR_REQUESTS: `${MENTORSHIP_BASE}/requests/mentor`,
    GET_USER_REQUESTS: `${MENTORSHIP_BASE}/requests/user`,
    RESPOND_TO_REQUEST: (requestId: string) => `${MENTORSHIP_BASE}/request/${requestId}/respond`,
    CONFIRM_SUGGESTION: (requestId: string) => `${MENTORSHIP_BASE}/request/${requestId}/confirm`,
    VERIFY_PAYMENT: (requestId: string) => `${MENTORSHIP_BASE}/request/${requestId}/verify-payment`,
    CREATE_CHECKOUT_SESSION: '/payments/checkout-mentorship',
    GET_ACTIVE_MENTORSHIP: `${MENTORSHIP_BASE}/active`,
    GET_MENTORSHIP_DETAIL: (mentorshipId: string) => `${MENTORSHIP_BASE}/${mentorshipId}`,
    BOOK_SESSION: (mentorshipId: string) => `${MENTORSHIP_BASE}/${mentorshipId}/book-session`,
    RESCHEDULE_SESSION: (mentorshipId: string) => `${MENTORSHIP_BASE}/${mentorshipId}/reschedule-session`,
    COMPLETE_MENTORSHIP: (mentorshipId: string) => `${MENTORSHIP_BASE}/${mentorshipId}/complete`,
    SUBMIT_FEEDBACK: (mentorshipId: string) => `${MENTORSHIP_BASE}/${mentorshipId}/feedback`,
    CANCEL_MENTORSHIP: (mentorshipId: string) => `${MENTORSHIP_BASE}/${mentorshipId}/cancel`,
};


const BOOKING_BASE = '/booking';
export const BookingRoutes = {
    BASE: BOOKING_BASE,
    CREATE_BOOKING: BOOKING_BASE,
    USER_SPECIFIC_BOOKING: `${BOOKING_BASE}/user`,
    MENTOR_SPECIFIC_BOOKING: `${BOOKING_BASE}/mentor`,
    UPDATE_BOOKING_STATUS: `${BOOKING_BASE}/status`,
    REQUEST_RESCHEDULE: `${BOOKING_BASE}/reschedule-request`,
    RESPOND_TO_RESCHEDULE: `${BOOKING_BASE}/reschedule-respond`,
    VERIFY_ACCESS: (bookingId: string) => `${BOOKING_BASE}/verify/${bookingId}`,
    START_SESSION: (bookingId: string) => `${BOOKING_BASE}/start-session/${bookingId}`,
    END_SESSION: (bookingId: string) => `${BOOKING_BASE}/end-session/${bookingId}`,
    GET_BOOKING_BY_ID: (bookingId: string) => `${BOOKING_BASE}/${bookingId}`,
};


const GAMIFICATION_BASE = '/gamification'
export const GamificationRoutes ={
    CONSTANTS: `${GAMIFICATION_BASE}/constants`,
    BADGES: `${GAMIFICATION_BASE}/badges`,
    CREATE_BADGE: `${GAMIFICATION_BASE}/badges`,
    UPDATE_BADGE: (badgeId: string) => `${GAMIFICATION_BASE}/badges/${badgeId}`,
    DELETE_BADGE: (badgeId: string) => `${GAMIFICATION_BASE}/badges/${badgeId}`,
}

const KANBAN_BASE = '/kanban';
export const KanbanRoutes = {
    BASE: KANBAN_BASE,
    CREATE_BOARD: `${KANBAN_BASE}/board`,

    CREATE_TASK: `${KANBAN_BASE}/task/add`,
    UPDATE_TASK: `${KANBAN_BASE}/task`,
    DELETE_TASK: (id: string) => `${KANBAN_BASE}/task/${id}`,
    REORDER_TASK: `${KANBAN_BASE}/task/reorder`,
}


const NOTE_BASE = '/notes';
export const NoteRoutes = {
    CREATE_NOTE: `${NOTE_BASE}`,
    GET_NOTES: `${NOTE_BASE}`,
    UPDATE_NOTE: (noteId: string) => `${NOTE_BASE}/${noteId}`,
    DELETE_NOTE: (noteId: string) => `${NOTE_BASE}/${noteId}`,
}

const PLANNER_BASE = '/planner';
export const PlannerRoutes = {
    BASE: PLANNER_BASE,
    CREATE_TASK: `${PLANNER_BASE}/task/add`,
    UPDATE_TASK: (taskId:string)=>`${PLANNER_BASE}/${taskId}`,
    DELETE_TASK: (taskId: string) => `${PLANNER_BASE}/${taskId}`,
    REORDER_TASK: `${PLANNER_BASE}/task/reorder`,
}


const POMODORO_BASE = '/pomodoro';
export const PomodoroRoutes = {
    BASE: POMODORO_BASE,
    CREATE_SESSION: `${POMODORO_BASE}/session`,
    GET_STATS: `${POMODORO_BASE}/stats`,
    LOG_SESSION: `${POMODORO_BASE}/log`,
}

const REVIEWS_BASE = '/reviews';
export const ReviewRoutes = {
    CREATE_REVIEW: REVIEWS_BASE,
    MENTOR_REVIEWS: (mentorId: string) => `${REVIEWS_BASE}/mentor/${mentorId}`,
    USER_REVIEWS: (userId: string) => `${REVIEWS_BASE}/user/${userId}`,
    UPDATE_REVIEW: (reviewId: string) => `${REVIEWS_BASE}/${reviewId}`,
    DELETE_REVIEW: (reviewId: string) => `${REVIEWS_BASE}/${reviewId}`,
};

const WALLET_BASE = '/mentorship/wallet';
export const WalletRoutes = {
    BASE: WALLET_BASE,
    CREATE_WITHDRAWAL: `${WALLET_BASE}/withdraw`,
    UPDATE_BANK_DETAILS: `${WALLET_BASE}/bank-details`,
    GET_TRANSACTIONS: `${WALLET_BASE}/transactions`,
}