import { BadgeTemplate, GamificationEvent, IconType, Rarity } from "@/types/gamification.types";

export interface CreateBadgeRequestDto{
 name :string,
 story : string,
 template : BadgeTemplate,
 threshold:number,
 design:{
    iconType : IconType;
    iconName ?:string;
    imageUrl?:string;
    primaryColor:string;
    bgColor:string;
    rarity:Rarity;
 };
 triggerEvent:GamificationEvent;
 isHidden: boolean;
 isActive : boolean;
 createdBy : string;
}