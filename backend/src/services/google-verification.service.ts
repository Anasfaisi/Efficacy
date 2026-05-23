import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { injectable } from 'inversify';
import { IGoogleVerificationService } from './Interfaces/IGoogle-verifcation.service';

@injectable()
export class GoogleVerificationService implements IGoogleVerificationService {
    private _client: OAuth2Client;

    constructor() {
        this._client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async verify(googleToken: string): Promise<LoginTicket> {
        return this._client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    }
}
