import { IPlan } from "@/models/Plan.model";

export class planMapper{
  static ToResponse(data:Partial<IPlan>){
    return {
      _id:data._id,
      name:data.name,
      price:data.price,
      billingCycleDays:data.billingCycleDays,
      limitations:data.limitations,
      features:data.features,
      isActive:data.isActive,
      mentorType:data.mentorType,
    }
  }
}