import { RequestPaymentDto } from '@/Dto/requestDto';
import { ResponsePaymentDto } from '@/Dto/responseDto';

export interface IPaymentService {
    createCheckoutSession(dto: RequestPaymentDto): Promise<ResponsePaymentDto>;
    verifyCheckoutSession(sessionId: string): Promise<ResponsePaymentDto>;
    handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void>;
}
