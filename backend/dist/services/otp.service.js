"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class OtpService {
    async generateOtp() {
        return otp_generator_1.default.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
    }
    async sendOtp(email, otp) {
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: `"Efficacy" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        });
        console.log(`OTP for ${email}: ${otp}`);
    }
    async sendEmail(email, subject, text) {
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: `"Efficacy" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text,
        });
        console.log(`OTP for ${email}: ${subject}`);
    }
}
exports.OtpService = OtpService;
//# sourceMappingURL=otp.service.js.map