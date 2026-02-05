export const AuthMessages = {
    LogoutSuccess: 'Logged out successfully',
    LogoutFailed: 'Logout failed',
    InvalidRefreshToken: 'Invalid refresh token or no refresh token',
    OtpFailed: 'OTP verification failed',
    OtpSuccess: 'OTP sent to email',
};

export const SuccessMessages = {
    ResourceDelivered: 'content delivered successfully',
    ProfilePicUpdated: 'Profile picture updated successfully',
    OtpSent: 'OTP sent succesfully',
    NotificationMarkedRead: 'Notification marked as read',
    AllNotificationsMarkedRead: 'All notifications marked as read',
    ApplicationApproved: 'Application approved successfully',
    ApplicationRejected: 'Application rejected',
    ChangesRequested: 'Changes requested',
    AdminLoginSuccess: 'adminlogin succesful',
    MentorStatusUpdated: 'Mentor status updated',
    UserStatusUpdated: 'User status updated successfully',
    MessageDeleted: 'Message deleted',
    NoteDeleted: 'Note deleted successfully',
    WithdrawalRequested: 'Withdrawal requested',
    ApplicationSubmitted: 'Application submitted successfully',
    MentorActivated: 'Mentor activated successfully',
    PasswordResetSuccess: 'Password reset successful',
};

export const NotificationMessages = {
    MentorAppApprovedTitle: 'Application Approved',
    MentorAppRejectedTitle: 'Application Rejected',
    ChangesRequestedTitle: 'Changes Requested',
    NewBookingRequestTitle: 'New Booking Request',
    BookingConfirmedTitle: 'Booking Confirmed',
    BookingStatusUpdatedTitle: 'Booking Status Updated',
    RescheduleRequestTitle: 'Reschedule Request',
    RescheduleAcceptedTitle: 'Reschedule Accepted',
    RescheduleRejectedTitle: 'Reschedule Rejected',
    NewMentorAppTitle: 'New Mentor Application',
    NewMentorshipRequestTitle: 'New Mentorship Request',
    MentorshipRequestAcceptedTitle: 'Mentorship Request Accepted',
    MentorshipRequestRejectedTitle: 'Mentorship Request Rejected',
    MentorshipSuggestionAcceptedTitle: 'Mentorship Suggestion Accepted',
    MentorshipCancelledTitle: 'Mentorship Cancelled',
    MentorshipActiveTitle: 'Mentorship Active',
    MentorshipCompletedTitle: 'Mentorship Completed',
};

export const CommonMessages = {
    UnexpectedError: 'An unexpected error occurred',
    Unauthorized: 'Unauthorized',
    UserNotAuthenticated: 'User not authenticated',
    MentorNotAuthenticated: 'Mentor not authenticated',
    NotAuthenticated: 'Not authenticated',
};

export const ErrorMessages = {
    InvalidCredentials: 'Invalid email or password',

    OtpExpired: 'OTP expired Try to resend the otp',
    UpdateFailed: 'can"t able to find the user with this id',
    UpdateUserFailed: 'Invalid user data provided',
    UpdateProfilePicFailed: 'Invalid form of data',
    FileNotAttached: 'No image uploaded',
    NoParams: 'id not found',

    NoBoard: 'No kanban board found for this user',
    NoBody: 'The requested body is empty',
    NotAdded: 'could not able to the new task',

    NoAdmin: 'No admin is found on this email',
    ApplicationNotFound: 'Application not found',
    UserNotFound: 'User not found',
    MentorNotFound: 'Mentor not found',
    LoginFailed: 'Login failed',
    TokenRefreshFailed: 'Token refresh failed',
    FetchMentorsFailed: 'Failed to fetch mentors',
    GoogleLoginFailed: 'Google login failed',
    ResetPasswordFailed: 'Failed to reset password',
    ForgotPasswordFailed: 'Failed to send reset link',
    ResendOtpFailed: 'Failed to resend OTP',
    ArrayUpdateFailed: 'Array update failed',
    MediaUpdateFailed: 'Media update failed',
    GeneralUpdateFailed: 'Update failed',
    UserContextMissing: 'User context missing',
    WebhookError: 'Webhook error',
    NoFileUploaded: 'No file uploaded',
    NoteNotFound: 'Note not found',
    TaskNotFound: 'Task not found',
    PomodoroRequiredFields: 'Duration and type are required',
    DateRequired: 'Date is required',
    MentorIdNotFound: 'Mentor ID not found in session',
    MentorUpdateFailed: 'Could not update mentor documentation',
    MentorNotApproved: 'Mentor must be approved before activation',
    MentorshipAlreadyExists: 'You already have an ongoing mentorship request or active session with this mentor.',
    MentorshipNotFound: 'Mentorship not found',
    MentorshipNotActive: 'Mentorship is not active',
    NoSessionsRemaining: 'No sessions remaining',
    SessionNotFound: 'Session not found',
    RescheduleTimeLimitMentorship: 'Rescheduling must be done at least 6 hours in advance',
    CancelOnlyActive: 'Can only cancel active mentorships',
    CancellationExpired: 'Cancellation period (7 days) has expired',
    InvalidCheckoutSession: 'checkout session not valid or not paid',
    WebhookSignatureFailed: 'Webhook signature verification failed',
    AccessDenied: 'Access denied to this room',
    JoinChatRoomFailed: 'Failed to join chat room',
    SendMessageFailed: 'Failed to send message',
    OtpUpdateFailed: 'error happened in updating user otp',
    AccountBlocked: 'Account is blocked. Please contact support.',
    AccountInactive: 'Account is inactive',
    EmailAlreadyRegistered: 'Email already registered',
    OtpAlreadySent: 'OTP already sent to this email',
    RegistrationReinitRequired: 'Re-initiate registration for this email',
    InvalidRole: 'Invalid role provided',
    SessionExpired: 'Session expired, please register again',
    UserCreationFailed: 'Error occurred while creating user',
    NoEmailFromGoogle: 'Google login failed: No email found',
    PastDateBooking: 'Cannot book sessions for past dates.',
    ExistingBookingDay: 'You already have a booking scheduled for this day. Only one session per day is allowed.',
    SlotAlreadyBooked: 'This slot is already booked for the mentor.',
    MentorNotAvailableDay: 'Mentor is not available on this day.',
    MentorNotAvailableSlot: 'Mentor is not available at this slot.',
    BookingLimitReached: 'You have reached the maximum limit of 10 bookings in a 30-day period.',
    BookingNotFound: 'Booking not found',
    BookingUpdateFailed: 'Failed to update booking',
    PastDateReschedule: 'Cannot reschedule to a past date.',
    RescheduleTimeLimit: 'Reschedule requests must be made at least 3 hours before the session. If not, the session is lost.',
    NoRescheduleRequest: 'No active reschedule request',
    ProposedSlotUnavailable: 'The proposed slot is no longer available.',
    IncorrectPassword: 'Current password is incorrect',
    InvalidPassword: 'Invalid password',
    AllFieldsRequired: 'Email, password, and name are required',
    InvalidRoleGoogleLogin: 'Invalid role for Google login',
    EmailPasswordRequired: 'Email and password are required',
    InvalidEmail: 'Invalid email format',
    PasswordComplexity: 'Password must be at least 6 characters',
    InsufficientBalance: 'Insufficient balance',
    ActiveMentorshipRequired: 'You must have an active mentorship to chat with this mentor.',
    MentorshipNotActiveOrCompleted: 'Mentorship is not active or completed.',
    ChatRoomNotFound: 'Chat room not found',
    DeleteOwnMessagesOnly: 'You can only delete your own messages',
    DeleteMessageFailed: 'Failed to delete message',
    MessageNotFound: 'Message not found',
    InvalidColumn: 'Invalid column',
    TaskNotFoundOrUnauthorized: 'Task not found or unauthorized',
};

export interface joinRoomPayload {
    roomId: string;
    user: string;
}

export interface SendMessagePayload {
    roomId: string;
    message: string;
    senderId: string;
    senderName: string;
}

export interface ChatMessageResponse {
    roomId: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: Date;
}
