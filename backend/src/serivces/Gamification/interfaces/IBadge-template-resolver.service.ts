import { GamificationEvent } from "@/types/gamification.types";
import { IBadgeEvaluator } from "./IBadge-evaluator";

export interface IBadgeTemplateResolverService{
    resolve(templateEvent:GamificationEvent):IBadgeEvaluator
}