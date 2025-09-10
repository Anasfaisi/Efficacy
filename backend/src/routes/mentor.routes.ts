import { RequestHandler, Router } from "express";
import { MentorController } from "@/controllers/mentor.controller";

export default function mentorRoutes(mentorController: MentorController) {
  const router = Router();

  router.post("/login", mentorController.login.bind(mentorController));
  router.post("/logout", mentorController.logout.bind(mentorController));

  router.post("/register/init", mentorController.registerInit.bind(mentorController));
  router.post("/register/verify",mentorController.registerVerify.bind(mentorController))


  router.post(
    "/google-login",
    mentorController.googleAuth.bind(mentorController)
  );

  return router;
}
