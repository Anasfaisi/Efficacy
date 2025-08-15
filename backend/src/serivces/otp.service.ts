// backend/src/services/otp.service.ts
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { IOtpService } from "./Interfaces/IOtp.service";

export class OtpService implements IOtpService{
  async generateOtp(): Promise<string> {
    return otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }

  async sendOtp(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    console.log(`OTP for ${email}: ${otp}`);
  }
}
