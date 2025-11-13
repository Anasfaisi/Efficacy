import { RequestPaymentDto } from '@/Dto/request.dto';
import { ResponsePaymentDto } from '@/Dto/response.dto';

export interface IPaymentService {
    createCheckoutSession(dto: RequestPaymentDto): Promise<ResponsePaymentDto>;
    verifyCheckoutSession(sessionId: string): Promise<ResponsePaymentDto>;
    handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void>;
}
