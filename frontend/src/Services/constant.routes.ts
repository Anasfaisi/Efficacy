export const MentorRoutes = {
    MENTOR_APPLICATION_INIT: '/mentor/application/init',
    BASE: '/mentor',
    BASIC_MENTOR_PROFILE_BASIC: '/mentor/profile/basic-info',
    MEDIA_MENTOR_PROFILE_MEDIA: '/mentor/profile/media',
    ARRAY_MENTOR_PROFILE_ARRAY: '/mentor/profile/array',
    ACTIVATE_MENTOR: '/mentor/activate',
    MENTOR_PROFILE: '/mentor/profile',
    APPROVED_MENTORS_LIST: '/mentor/list/approved',
    VERIFY_OTP: '/mentor/register/verify',
    MENTOR_RESEND_OTP: '/mentor/resend-otp',
    MENTOR_FORGOT_PASSWORD: '/mentor/forgot-password',
    MENTOR_RESET_PASSWORD: '/mentor/reset-password',
    MENTOR_NOTIFICATIONS: '/mentor/notifications',
    MENTOR_MARK_ALL_NOTIFICATION_AS_READ: '/mentor/notifications/mark-all-read',

    MENTOR_MARK_NOTIFICATION_AS_READ: (notificationId: string) =>
        `/mentor/notifications/${notificationId}/mark-read`,
    FETCH_MENTOR: (mentorId: string) => `/mentor/${mentorId}`,
};

export const AdminRoutes = {
    BASE: '/admin',
    ADMINLOGIN: '/admin/login',
    MENTOR_APPLICATIONS: '/admin/mentors/applications',
    MENTOR_APPLICATIONS_ID: '/admin/mentors/applications',
    MENTORS: '/admin/mentors',
    USERS: '/admin/users',
    NOTIFICATIONS_MARK_ALL_READ: '/admin/notifications/mark-all-read',
    REVENUE: '/admin/revenue',
    TRANSACTIONS: '/admin/transactions',
    DASHBOARD_STATS: '/admin/dashboard-stats',
    NOTIFICATIONS: '/admin/notifications',
    USERS_STATUS: (userId: string) => `/admin/users/${userId}/status`,
    NOTIFICATION_MARK_READ: (notificationId: string) =>
        `/admin/notification/${notificationId}/mark-read`,
    MENTORS_ID: (mentorId: string) => `admin/mentors/${mentorId}`,
    MENTORS_STATUS: (mentorId: string) => `admin/mentors/${mentorId}/status`,
    MENTOR_APPLICATION_APPROVE: (applicationId: string) =>
        `admin/mentors/applications/${applicationId}`,
    MENTOR_APPLICATION_REJECT: (applicationId: string) =>
        `admin/mentors/applications/${applicationId}`,
    MENTOR_APPLICATION_BY_ID: (applicationId: string) =>
        `/admin/mentors/applications/${applicationId}`,
    MENTOR_APPLICATIONS_REQUEST_CHANGES: (applicationId: string) =>
        `admin/mentors/applications/${applicationId}/request-changes`,
};

export const ChatRoutes = {
    BASE: '/chat',
    INITIATE: '/chat/initiate',
    MY_CONVERSATION: '/chat/my-conversations',
    MESSAGES: '/chat/messages',
    UPLOAD: '/chat/upload',
    DELETE_MESSAGE: '/chat/messages',
};

export const MentorshipRoutes = {
    BASE: '/mentorship',
    CREATE_REQUEST: '/mentorship/request',
    GET_MENTOR_REQUESTS: '/mentorship/requests/mentor',
    GET_USER_REQUESTS: '/mentorship/requests/user',
    RESPOND_TO_REQUEST: (requestId: string) => `/mentorship/request/${requestId}/respond`,
    CONFIRM_SUGGESTION: (requestId: string) => `/mentorship/request/${requestId}/confirm`,
    VERIFY_PAYMENT: (requestId: string) => `/mentorship/request/${requestId}/verify-payment`,
    CREATE_CHECKOUT_SESSION: '/payments/checkout-mentorship',
    GET_ACTIVE_MENTORSHIP: '/mentorship/active',
    GET_MENTORSHIP_DETAIL: (mentorshipId: string) => `/mentorship/${mentorshipId}`,
    BOOK_SESSION: (mentorshipId: string) => `/mentorship/${mentorshipId}/book-session`,
    RESCHEDULE_SESSION: (mentorshipId: string) => `/mentorship/${mentorshipId}/reschedule-session`,
    COMPLETE_MENTORSHIP: (mentorshipId: string) => `/mentorship/${mentorshipId}/complete`,
    SUBMIT_FEEDBACK: (mentorshipId: string) => `/mentorship/${mentorshipId}/feedback`,
    CANCEL_MENTORSHIP: (mentorshipId: string) => `/mentorship/${mentorshipId}/cancel`,
};


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

