import { CreateBadgeResponseDto } from "@/Dto/badge-response.dto";
import { IBadge } from "@/models/Badge.model";

export class BadgeMapper{
    static ToResponseDto(badge:IBadge):CreateBadgeResponseDto{
      return{
        name:badge.name,
        story:badge.story,
        template:badge.template,
        threshold:badge.threshold,
        design:badge.design,
        triggerEvent:badge.triggerEvent,
        isHidden:badge.isHidden,
        isActive:badge.isActive,
      }   
    }
}   