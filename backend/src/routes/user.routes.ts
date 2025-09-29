import { Router } from "express";
import { RequestHandler } from "express";
import { UserController } from "../controllers/user.controller";

export default function authRoutes(userController: UserController) {
  const router = Router();
  
  router.get("/me/:id", userController.getCurrentUser.bind(userController)as RequestHandler)
  router.post("/login", userController.login.bind(userController));
  router.post("/logout",userController.logout.bind(userController) as RequestHandler);
  router.post("/google-login", userController.googleAuth.bind(userController));
  
  router.post("/refresh", userController.refreshTokenHandler.bind(userController));
  
  router.post("/register/init",userController.registerInit.bind(userController));
  router.post("/register/verify",userController.registerVerify.bind(userController));
  router.post("/register/resend-otp", userController.resendOtp.bind(userController));
  
  router.post("/forgot-password/init",userController.forgotPassword.bind(userController));
  router.post("/forgot-password/verify",userController.resetPassword.bind(userController));
  // router.post("/register", userController.register.bind(userController));
  return router;
}
