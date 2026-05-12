import { RequestPaymentDto } from '@/dto/request.dto';
import { ResponsePaymentDto } from '@/dto/response.dto';

export interface IPaymentService {
    createCheckoutSession(dto: RequestPaymentDto): Promise<ResponsePaymentDto>;
    verifyCheckoutSession(sessionId: string): Promise<ResponsePaymentDto>;
    createMentorshipCheckoutSession(
        mentorshipId: string,
        successUrl: string,
        cancelUrl: string
    ): Promise<ResponsePaymentDto>;
    handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void>;
}
