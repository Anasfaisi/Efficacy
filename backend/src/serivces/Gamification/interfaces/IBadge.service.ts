import { CreateBadgeRequestDto } from "@/dto/badge-request.dto";
import { CreateBadgeResponseDto } from "@/dto/badge-response.dto";
import { UserBadgeEntity } from "@/entity/user-badge.entity";

export interface IBadgeService{
    createBadge(badgeData : CreateBadgeRequestDto): Promise<CreateBadgeResponseDto>
    getAllBadges(page : number , limit : number): Promise<{badges : CreateBadgeResponseDto[] , total : number}>
    updateBadge(badgeId : string , badgeData : CreateBadgeRequestDto): Promise<CreateBadgeResponseDto>
    toggleBadgeStatus(badgeId:string,status:boolean):Promise<CreateBadgeResponseDto>
    getBadgeById(badgeId : string): Promise<CreateBadgeResponseDto>
    getUserBadges(userId:string):Promise<UserBadgeEntity[]>
}