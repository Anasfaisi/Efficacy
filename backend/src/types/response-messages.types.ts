export const AuthMessages = {
    LogoutSuccess: 'Logged out successfully',
    LogoutFailed: 'Logout failed',
    InvalidRefreshToken: 'Invalid refresh token or no refresh token',
    OtpFailed: 'OTP verification failed',
    OtpSuccess: 'OTP sent to email',
};

export const ErrorMessages = {
    UpdateFailed: 'can"t able to find the user with this id',
    UpdateUserFailed: 'Invalid user data provided',
    UpdateProfilePicFailed: 'Invalid form of data',
    FileNotAttached: 'No image uploaded',
    NoParams: 'id not found',

    NoBoard: 'No kanban board found for this user',
    NoBody: 'The requested body is empty',
    NotAdded:'could not able to the new task',

    //admin
    NoAdmin: 'No admin is found on this email'
};

export const SuccessMessages = {
    ResourceDelivered: 'content delivered successfully',
};
// types for chat controller
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
