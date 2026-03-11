import { EventEmitter } from 'events';
import { GamificationEvent } from '../types/gamification.types';
import { Types } from 'mongoose';

class GamificationEventBus extends EventEmitter {}

export const eventBus = new GamificationEventBus();
export interface GamificationEventPayload {
    userId: string | Types.ObjectId;
    [key: string]: any;
}

export const emitGamificationEvent = (
    event: GamificationEvent,
    payload: GamificationEventPayload
) => {
    eventBus.emit(event, payload);
};

export const subscribeToGamificationEvent = (
    event: GamificationEvent,
    listener: (payload: GamificationEventPayload) => void | Promise<void>
) => {
    eventBus.on(event, listener);
};
