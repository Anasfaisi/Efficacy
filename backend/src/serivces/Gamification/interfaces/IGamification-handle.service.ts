import { GamificationEvent } from "@/types/gamification.types";

export interface IGamificationHandleService {
    processAction(event:GamificationEvent,userId:string):Promise<void>   
}