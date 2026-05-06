import { CreateBadgeRequestDto } from "@/dto/badge-request.dto";
import { UserStatsEntity } from "@/entity/user-stats.entity";
import { GamificationEvent } from "@/types/gamification.types";

export interface IBadgeGamificationService {
    evaluate(event : GamificationEvent, userstats:UserStatsEntity):Promise<void>;
    unlockBadge(badge: CreateBadgeRequestDto): Promise <void>
}