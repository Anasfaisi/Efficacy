import { createPlanResponseDto, createPlanRequestDto } from "@/dto/plan.dto";
import { IPlan } from "@/models/Plan.model";
import { FilterQuery } from "mongoose";

export interface IPlanService{
    createPlan(createPlanRequestDto:createPlanRequestDto):Promise<createPlanResponseDto>
    getAllPlans(page: number, limit: number, search?: string, status?: string): Promise<{ data: createPlanResponseDto[], total: number }>
    getPlanById(planId:string):Promise<createPlanResponseDto | null>
    updatePlan(planId:string,data:Partial<IPlan>):Promise<void >
    deletePlan(planId:string,data:Partial<IPlan>):Promise<void>
}