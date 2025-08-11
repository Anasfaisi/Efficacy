import { Request, Response } from "express";
import { AuthService } from "../serivces/AuthSerivice";
import { ValidationService } from "../serivces/ValidationService";
import { TYPES } from "@/types";
import { inject } from "inversify";

export class MentorController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.ValidationService) private validationService: ValidationService
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      this.validationService.validateRegisterInput({ email, password, name });
      const result = await this.authService.registerUser({
        email,
        password,
        name,
        role
      });
      res.cookie("refreshToken",result.refreshToken,{
        httpOnly:true,
        secure:true,
      })
      res.json({accessToken:result.accessToken,user:result.user})
    } catch (error:any) {
       res.status(400).json({message:error.message})
    }
  }
}
