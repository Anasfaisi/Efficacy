import { Router } from "express";
import { RequestHandler } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export default function authRoutes(userController: UserController) {
  const router = Router();

  router.post("/register", userController.register.bind(userController));
  router.post("/login", userController.login.bind(userController));
  router.post("/refresh", userController.refresh.bind(userController));
  router.post(
    "/logout",
    userController.logout.bind(userController) as RequestHandler
  );

  router.post("/google-login", userController.googleAuth.bind(userController));
  router.post(
    "/register/init",
    userController.registerInit.bind(userController)
  );
  return router;
}
