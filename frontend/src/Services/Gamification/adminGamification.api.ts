import type { Badge } from '@/types/gamification';
import api from '../axiosConfig';
import { GamificationRoutes } from '../constant.routes';

export const adminGamificationApi = {
    getConstants: async (): Promise<{
        success: boolean;
        templates: string[];
        triggerEvents: string[];
        rarities: string[];
    }> => {
        const response = await api.get(GamificationRoutes.CONSTANTS);
        return response.data;
    },

    getAllBadges: async (
        page = 1,
        limit = 10
    ): Promise<{ success: boolean; badges: Badge[]; total: number }> => {
        const response = await api.get(GamificationRoutes.BADGES, {
            params: { page, limit },
        });
        return response.data;
    },

    createBadge: async (
        data: Partial<Badge>
    ): Promise<{ success: boolean; badge: Badge }> => {
        const response = await api.post(GamificationRoutes.CREATE_BADGE, data);
        return response.data;
    },

    updateBadge: async (
        id: string,
        data: Partial<Badge>
    ): Promise<{ success: boolean; badge: Badge }> => {
        const response = await api.put(
            GamificationRoutes.UPDATE_BADGE(id),
            data
        );
        return response.data;
    },

    deleteBadge: async (id: string): Promise<{ success: boolean }> => {
        const response = await api.delete(GamificationRoutes.DELETE_BADGE(id));
        return response.data;
    },
};
