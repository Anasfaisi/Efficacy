import { GamificationEvent } from "@/types/gamification.types";

export interface ITaskGamificationHandleService {
    processAction(event:GamificationEvent,userId:string):Promise<void>   
}