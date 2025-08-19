export class ForgotPasswordRequestDto {
  constructor(public readonly email: string) {}
}

export class ForgotPasswordVerifyDto {
  constructor(
    public readonly email: string,
    public readonly otp: string,
    public readonly newPassword: string,
    public readonly tempUserId: string
  ) {}
}

export class ResetPasswordrequestDto{
  constructor(
    public readonly token:string,
    public readonly newPassword:string,
  ){}
}