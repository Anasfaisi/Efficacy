export interface IOtpService {
    generateOtp(): Promise<string>;
    sendOtp(email: string, otp: string): Promise<void>;
    sendEmail(email: string, subject: string, text: string): Promise<void>;
}
