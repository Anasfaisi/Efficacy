import { LoginTicket } from 'google-auth-library';
export interface IGoogleVerificationService {
    verify(googleToken: string): Promise<LoginTicket>;
}
