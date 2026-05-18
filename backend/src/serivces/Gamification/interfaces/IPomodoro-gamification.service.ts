import { GamificationEvent } from "@/types/gamification.types";

export interface IPomodoroGamificationService{
    handlePomodoroCompletion(event : GamificationEvent,userId:string,):Promise<void>
}