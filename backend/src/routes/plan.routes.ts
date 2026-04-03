import { PlanController } from "@/controllers/plan.controller";
import { Router } from "express";

export default function planRoutes(planController:PlanController){
    const router = Router()
    router.post("/create",planController.createPlan.bind(planController))
    router.get("/all",planController.getAllPlans.bind(planController))
    router.get("/:planId",planController.getPlanById.bind(planController))
    router.put("/:planId",planController.updatePlan.bind(planController))
    router.delete("/:planId",planController.deletePlan.bind(planController))
    return router
}