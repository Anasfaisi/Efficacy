import { RequestHandler, Router } from "express";
import { MentorController } from "@/controllers/mentor.controller";

export default function mentorRoutes(mentorController: MentorController) {
  const router = Router();

  router.post("/register", mentorController.register.bind(mentorController));
  router.post("/login", mentorController.login.bind(mentorController));
  router.post("/logout", mentorController.logout.bind(mentorController));
  router.post(
    "/google-login",
    mentorController.googleAuth.bind(mentorController)
  );

  return router;
}
