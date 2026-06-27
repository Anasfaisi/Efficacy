import { container } from '@/config/inversify.config';
import { IMentorshipService } from '../services/Interfaces/IMentorship.service';
import { TYPES } from '@/config/inversify-key.types';
import { logger } from './logMiddlewares';

export function cronJob() {
    const mentorshipService = container.get<IMentorshipService>(
        TYPES.MentorshipService
    );
    mentorshipService
        .runDailyCompletionCheck()
        .then(() =>
            logger.info('Startup mentorship completion check successful.')
        )
        .catch((err) =>
            logger.error('Error in startup mentorship completion check:', err)
        );

    setInterval(
        () => {
            logger.info(
                'Executing scheduled daily mentorship completion check...'
            );
            mentorshipService
                .runDailyCompletionCheck()
                .catch((err) =>
                    logger.error('Error in daily completion check:', err)
                );
        },
        24 * 60 * 60 * 1000 * 7
    );
}
