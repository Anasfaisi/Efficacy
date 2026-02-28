import api from './axiosConfig';

export interface IBadge {
  _id?: string;
  name: string;
  story: string;
  template: string;
  threshold: number;
  design: {
    iconType: 'icon' | 'image';
    iconName?: string;
    imageUrl?: string;
    primaryColor: string;
    bgColor: string;
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  };
  triggerEvent: string;
  isHidden: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGamificationConstants {
  templates: string[];
  triggerEvents: string[];
  rarities: string[];
}

export const adminGamificationApi = {
  getConstants: async (): Promise<{ success: boolean; templates: string[]; triggerEvents: string[]; rarities: string[] }> => {
    const response = await api.get('/gamification/constants');
    console.log(response.data);
    return response.data;
  },

  getAllBadges: async (): Promise<{ success: boolean; badges: IBadge[] }> => {
    const response = await api.get('/gamification/badges');
    return response.data;
  },

  createBadge: async (data: Partial<IBadge>): Promise<{ success: boolean; badge: IBadge }> => {
    const response = await api.post('/gamification/badges', data);
    return response.data;
  },

  updateBadge: async (id: string, data: Partial<IBadge>): Promise<{ success: boolean; badge: IBadge }> => {
    const response = await api.put(`/gamification/badges/${id}`, data);
    return response.data;
  },

  deleteBadge: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/gamification/badges/${id}`);
    return response.data;
  }
};
