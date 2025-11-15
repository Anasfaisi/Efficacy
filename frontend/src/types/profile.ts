export interface AvatarUploadProps {
  onFileChange: (file: File | null) => void;
}

export interface ProfileForm {
  name: string;
  email: string;
  userId: string;
  headline: string;
  bio: string;
  xpPoints: number;
  league: string;
  currentStreak: number;
}
