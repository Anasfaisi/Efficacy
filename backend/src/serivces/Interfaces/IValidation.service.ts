
export interface IValidationService {
  validateLoginInput(params: {
    email: string;
    password: string;
    role?: string;
  }): void;

  validateRegisterInput(params: {
    email: string;
    password: string;
    name: string;
  }): void;

  validateGoogleLoginInput(params: {
    role?: string;
    endpoint: "admin" | "user" | "mentor";
  }): void;
}
