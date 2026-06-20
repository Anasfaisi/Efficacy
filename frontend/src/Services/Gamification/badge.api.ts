import type { Badge } from '@/types/gamification';
import api from '../axiosConfig';
import { BadgeRoutes } from '../constant.routes';

export const badgeApi = {
    createBadge: async (
        data: Partial<Badge>
    ): Promise<{ success: boolean; badge: Badge }> => {
        const response = await api.post(BadgeRoutes.CREATE_BADGE, data);
        return response.data;
    },

    getAllBadges: async (
        page: number,
        limit: number
    ): Promise<{
        success: boolean;
        total: number;
        badges: Badge[];
    }> => {
        const response = await api.get(BadgeRoutes.GET_ALL_BADGES, {
            params: { page, limit },
        });
        return response.data;
    },

    updateBadge: async (
        badgeId: string,
        data: Partial<Badge>
    ): Promise<{ success: boolean; badge: Badge }> => {
        const response = await api.put(BadgeRoutes.UPDATE_BADGE(badgeId), data);
        return response.data;
    },

    toggleBadgeStatus: async (
        badgeId: string,
        status: boolean
    ): Promise<{ status: boolean; badge: Badge }> => {
        const response = await api.patch(
            BadgeRoutes.TOGGLE_BADGE_STATUS(badgeId),
            { status }
        );
        return response.data;
    },
};
