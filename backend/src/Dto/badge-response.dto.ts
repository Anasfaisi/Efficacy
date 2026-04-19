import { GamificationEvent, IconType, Rarity } from "@/types/gamification.types";

export interface CreateBadgeResponseDto{
    name: string;
    story : string;
    template : string;
    threshold : number;
    design : {
        iconType : IconType;
        iconName? : string; 
        imageUrl? : string;
        primaryColor : string; 
        bgColor : string;
        rarity : Rarity;
    };
    triggerEvent : GamificationEvent;
    isHidden : boolean;
    isActive : boolean; 
}