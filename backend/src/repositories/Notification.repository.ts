import { INotification, NotificationModel } from '@/models/Notification.model';
import { BaseRepository } from './base.repository';
import { INotificationRepository } from './interfaces/INotification.repository';
import { injectable } from 'inversify';

@injectable()
export class NotificationRepository
    extends BaseRepository<INotification>
    implements INotificationRepository
{
    constructor() {
        super(NotificationModel);
    }

    async findByRecipient(recipientId: string): Promise<INotification[]> {
        return this.model.find({ recipientId }).sort({ createdAt: -1 }).exec();
    }
}
