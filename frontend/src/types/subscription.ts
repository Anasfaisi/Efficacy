export interface Subscription {
  priceId: string;
  plan: 'Basic' | 'Starter' | 'Pro';
  sessionsLeft: number;
  totalSessions: number;
  startDate: string; 
  endDate: string; 
  status: 'active' | 'expired' | 'cancelled';
}
