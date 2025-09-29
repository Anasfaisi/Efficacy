import { IUser } from "@/models/User.model";
import { Role } from "@/types/role.types";

//Login
export class LoginRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role :Role,
    public readonly name? : string,
  ) {}
}


//Register
export class RegisterRequestDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role
  ) {}
}

//otp verification
export class OtpVerificationRequestDto {
  constructor(
    public readonly email: string,
    public readonly otp: string
  ) {}
}


//resend otp
export class resendOtpRequestDto {
  constructor(
    public readonly email:string,
  ){}
}


//forget password
export class ForgotPasswordRequestDto {
  constructor(public readonly email: string) {}
}


//reset password
export class ResetPasswordrequestDto{
  constructor(
    public readonly token:string,
    public readonly newPassword:string,
  ){}
}


//refreshing access token
export class RefreshRequestDto {}


//stripe checkout dto
export class CreateCheckoutDto {
  constructor(
    public readonly priceId: string,
    public readonly success_url: string,
    public readonly cancel_url: string,
    public readonly customerEmail?: string
  ) {
    if (!priceId) throw new Error("priceId is required");
  }
}

//request payment dto
export class RequestPaymentDto {
  constructor(
    public readonly userId: string,
    public readonly priceId: string,
    public readonly successUrl: string,
    public readonly cancelUrl: string
  ) {}
}

// DTO forincoming messages
export class SendMessageDto{
  constructor(
    public readonly roomId:string,
    public readonly senderId :string,
    public readonly senderName:string,
    public readonly message : String,
    public readonly createdAt : Date = new Date()
  ){}
}


//DTO for joining Room
export class JoinRoomDto{
  constructor(
    public readonly roomId :string,
    public readonly user: IUser
  ){}
}


export class CurrentUserReqDto{
  constructor(
    public readonly id:string
  ){}
}