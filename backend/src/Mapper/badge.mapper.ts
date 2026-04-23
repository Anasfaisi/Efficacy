import { CreateBadgeResponseDto } from "@/Dto/badge-response.dto";
import { IBadge } from "@/models/Badge.model";

export class BadgeMapper{
    static ToResponseDto(badge:IBadge):CreateBadgeResponseDto{
      return{
        id: badge._id?.toString(),
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

    static ToResponseDtoList(badges: IBadge[]): CreateBadgeResponseDto[] {
        return badges.map(BadgeMapper.ToResponseDto);
    }
}   