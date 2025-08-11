import { RequestHandler, Router } from "express";
import { MentorController } from "@/controllers/mentorController";


export default function mentorRoutes( mentorController : MentorController) {
  const router = Router();

  router.post("/register", mentorController.register.bind(mentorController))
    return router;

}
