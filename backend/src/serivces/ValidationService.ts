export class ValidationService {
  validateLoginInput({
    email,
    password,
    role,
    endpoint,
  }: {
    email: string;
    password: string;
    role?: string;
    endpoint: "admin" | "user"|"mentor";
  }) {
    console.log("it is reached in validationlogininput",email,role);
    if (!email || !password) {
      console.error(Error);
      throw new Error("Email and password are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (
      role &&
      ((endpoint === "admin" && role !== "admin") ||
        (endpoint === "user" && role !== "user"))
    ) {
      throw new Error(`Invalid role for ${endpoint} login`);
    }
    console.log("successfully validated at backend");
    
  }

  validateRegisterInput({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }
}
