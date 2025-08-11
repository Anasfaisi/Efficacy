import { OAuth2Client } from "google-auth-library";
import { injectable } from "inversify";

@injectable()
export class GoogleVerificationService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verify(googleToken: string) {
    return this.client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  }
}
