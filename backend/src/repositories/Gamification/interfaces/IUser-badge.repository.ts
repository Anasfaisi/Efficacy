import { IUserBadge } from "@/models/UserBadge.model";

export interface IUserBadgeRepository{
    findExistingBadge(badgeId:string):Promise<IUserBadge|null>
}