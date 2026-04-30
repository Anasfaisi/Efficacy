import { UserStatsEntity } from "@/entity/user-stats.entity"

export interface IUserStatsRepository{
    CreateUserStats(data:Partial<UserStatsEntity>):Promise<UserStatsEntity>;
    UpdateUserStats(userId:string,data:UserStatsEntity):Promise<UserStatsEntity|null>;
    FindByUserId(userId:string):Promise<UserStatsEntity|null>;
}