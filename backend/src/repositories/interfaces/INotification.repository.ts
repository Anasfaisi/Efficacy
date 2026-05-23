import { INotification } from '@/models/notification.model';
import { IBaseRepository } from './IBase.repository';

export interface INotificationRepository
    extends IBaseRepository<INotification> {
    findByRecipient(recipientId: string): Promise<INotification[]>;
}
