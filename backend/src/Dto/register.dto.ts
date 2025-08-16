export class RegisterRequestDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: "user" | "mentor" | "admin",
  ) {}
}



export class RegisterInitResponseDto  {
  constructor(
   public readonly tempUserId: string,
    public readonly email: string

  ) {}
}


export class OtpVerificationRequestDto {
  constructor(
    public readonly email: string,
    public readonly otp: string
  ) {}
}

export class OtpVerificationResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  ) {}
}

export class resendOtpRequestDto {
  constructor(
    public readonly email:string,
  ){}
}



