import { CreateBadgeRequestDto } from "@/Dto/badge-request.dto";
import { CreateBadgeResponseDto } from "@/Dto/badge-response.dto";

export interface IBadgeService{
    createBadge(badgeData : CreateBadgeRequestDto): Promise<CreateBadgeResponseDto>
    getAllBadges(page : number , limit : number): Promise<{badges : CreateBadgeResponseDto[] , total : number}>
    updateBadge(badgeId : string , badgeData : CreateBadgeRequestDto): Promise<CreateBadgeResponseDto>
    toggleBadgeStatus(badgeId:string,status:string):Promise<void>
    getBadgeById(badgeId : string): Promise<CreateBadgeResponseDto>
}