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