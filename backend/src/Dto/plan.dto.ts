import { IPlan } from "@/models/Plan.model";
import { FilterQuery } from "mongoose";

 export interface createPlanRequestDto{
    name:string,
    price:number,
    billingCycleDays:number,
    limitations:Record<string,number>,
    features:string[],
    isActive:boolean,
    mentorType?:string,
}

export interface getAllPlanRequestDto{
  filter?:FilterQuery<IPlan>
  page:number,
  limit:number,
}
export interface getAllPlanResponseDto{

}
export interface createPlanResponseDto{
    id?:string,
    name?:string,
    price?:number,
    billingCycleDays?:number,
    limitations?:Record<string,number>,
    features?:string[],
    isActive?:boolean,
    mentorType?:string,
}