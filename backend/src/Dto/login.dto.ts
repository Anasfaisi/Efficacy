export class LoginRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role :string,
    public readonly name? : string,
  ) {}
}
export class LoginResponseDTO {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: {
      id: string;
      name: string;
      email: string;
      role?: "user" | "mentor" | "admin";
    }
  ) {}

  toJSON() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      user: this.user
    };
  }
}
