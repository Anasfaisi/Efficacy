export interface Subscription {
  priceId:string
  plan: 'Basic' | 'Starter' | 'Pro';
  sessionsLeft: number;
  totalSessions: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  status: 'active' | 'expired' | 'cancelled';
}
