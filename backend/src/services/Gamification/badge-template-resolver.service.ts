import { BadgeTemplate } from '@/types/gamification.types';
import { IBadgeTemplateResolverService } from './interfaces/IBadge-template-resolver.service';
import { IBadgeEvaluator } from './interfaces/IBadge-evaluator';
import { TYPES } from '@/config/inversify-key.types';
import { ErrorMessages } from '@/types/response-messages.types';
import { injectable, multiInject } from 'inversify';

@injectable()
export class BadgeTemplateResolverService
    implements IBadgeTemplateResolverService
{
    constructor(
        @multiInject(TYPES.IBadgeEvaluator)
        private _templateEvaluator: IBadgeEvaluator[] //[new taskevaluator,new pomodoroevaluator]
    ) {}
    resolve(templateEvent: BadgeTemplate): IBadgeEvaluator {
        const badge = this._templateEvaluator.find(
            (bde) => bde.badgeTemplateEvent == templateEvent
        );
        if (!badge) throw new Error(ErrorMessages.NoEvaluator);

        return badge;
    }
}
