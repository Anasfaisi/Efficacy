import { RequestPaymentDto } from '@/dto/request.dto';
import { ResponsePaymentDto } from '@/dto/response.dto';

export interface IPaymentService {
    // createCheckoutSession(dto: RequestPaymentDto): Promise<ResponsePaymentDto>;
    verifyCheckoutSession(sessionId: string): Promise<ResponsePaymentDto>;
    createMentorshipCheckoutSession(
        mentorshipId: string,
        successUrl: string,
        cancelUrl: string
    ): Promise<ResponsePaymentDto>;
    handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void>;
    createExpressConnectAccount(email: string, mentorId: string): Promise<string>;
    createConnectAccountLink(accountId: string): Promise<string>;
    transferToConnectAccount(accountId: string, amount: number): Promise<string>;
    refundStripePayment(sessionId: string, amount: number): Promise<string>;
}
