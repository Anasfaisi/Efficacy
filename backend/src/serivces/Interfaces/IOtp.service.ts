export interface IOtpService {
  generateOtp(): Promise<string>;
  sendOtp(email: string, otp: string): Promise<void>;
}