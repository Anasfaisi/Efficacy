export const AuthMessages = {
  LogoutSuccess: "Logged out successfully",
  LogoutFailed: "Logout failed",
  InvalidRefreshToken: "Invalid refresh token or no refresh token",
  OtpFailed: "OTP verification failed",
  OtpSuccess: "OTP sent to email",
};

// types for chat controller
export interface joinRoomPayload{
  roomId:string;
  user:string;
}

export interface SendMessagePayload{
  roomId:string;
  message:string;
  senderId:string;
  senderName:string;

}

export interface ChatMessageResponse{
  roomId:string;
  senderId:string;
  senderName:string;
  message:string;
  createdAt:Date
}