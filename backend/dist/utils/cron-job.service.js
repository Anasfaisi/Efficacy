"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJob = cronJob;
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const logMiddlewares_1 = require("./logMiddlewares");
function cronJob() {
    const mentorshipService = inversify_config_1.container.get(inversify_key_types_1.TYPES.MentorshipService);
    mentorshipService
        .runDailyCompletionCheck()
        .then(() => logMiddlewares_1.logger.info('Startup mentorship completion check successful.'))
        .catch((err) => logMiddlewares_1.logger.error('Error in startup mentorship completion check:', err));
    setInterval(() => {
        logMiddlewares_1.logger.info('Executing scheduled daily mentorship completion check...');
        mentorshipService
            .runDailyCompletionCheck()
            .catch((err) => logMiddlewares_1.logger.error('Error in daily completion check:', err));
    }, 24 * 60 * 60 * 1000 * 1);
}
//# sourceMappingURL=cron-job.service.js.map