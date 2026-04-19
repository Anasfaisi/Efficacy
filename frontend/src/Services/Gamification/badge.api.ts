import type { Badge } from "@/types/gamification";
import api from "../axiosConfig"
import { BadgeRoutes } from "../constant.routes";

export const badgeApi = {
    createBadge: async (
        data: Partial<Badge>
    ): Promise<{ success: boolean; badge: Badge }> => {
        const response = await api.post(BadgeRoutes.CREATE_BADGE, data);
        return response.data;
    },

    getAllBadges: async (page: number, limit: number): Promise<{
        success: boolean;
        total: number;
        badges: Badge[];

    }> => {
        const response = await api.get(BadgeRoutes.GET_ALL_BADGES);
        return response.data;
    },

    updateBadge: async (
        id: string,
        data: Partial<Badge>
    ): Promise<{ success: boolean; badge: Badge }> => {
        const response = await api.put(
            BadgeRoutes.UPDATE_BADGE(id),
            data
        );
        return response.data;
    },

};