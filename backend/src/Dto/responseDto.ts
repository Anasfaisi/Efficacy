import { Role } from "@/types/role.types";

//login
export class LoginResponseDTO {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: {
      id: string;
      name: string;
      email: string;
      role?: Role;
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



//Register
export class RegisterInitResponseDto  {
  constructor(
   public readonly tempEmail: string,
   public readonly  role :string

  ) {}
}


//otpverification
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

//forget password
export class ForgotPasswordVerifyDto {
  constructor(
    public readonly email: string,
    public readonly otp: string,
    public readonly newPassword: string,
    public readonly tempUserId: string
  ) {}
}


//refreshing access token
export class RefreshResponseDto {
  constructor(
    public readonly success:string
  ){}
}

// export class SubscriptionResponseDTO {
//   constructor(
//     public readonly id: string,                
//     public readonly status: string,            
//     public readonly priceId: string,           
//     public readonly currentPeriodEnd: Date,    
//     public readonly user: {
//       id: string;
//       name: string;
//       email: string;
//     }
//   ) {}
// }


// Dto/responseDto/ResponsePayment.dto.ts
export class ResponsePaymentDto {
  constructor(
    public readonly sessionId: string,
    public readonly url: string
  ) {}
}

