import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IGamificationService } from '@/serivces/Interfaces/IGamification.service';
import { GamificationEvent, BadgeTemplate } from '@/types/gamification.types';

@injectable()
export class GamificationController {
    constructor(
        @inject(TYPES.GamificationService)
        private _gamificationService: IGamificationService
    ) {}

    public async createBadge(req: Request, res: Response): Promise<void> {
        const badgeData = req.body;
        const newBadge = await this._gamificationService.createBadge(badgeData);
        res.status(201).json({ success: true, badge: newBadge });
    }

    public async getAllBadges(req: Request, res: Response): Promise<void> {
        const badges = await this._gamificationService.getAllBadges();
        res.status(200).json({ success: true, badges });
    }

    public async getBadgeById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const badge = await this._gamificationService.getBadgeById(id);
        if (!badge) {
            res.status(404).json({
                success: false,
                message: 'Badge not found',
            });
            return;
        }
        res.status(200).json({ success: true, badge });
    }

    public async updateBadge(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const updateData = req.body;
        const updatedBadge = await this._gamificationService.updateBadge(
            id,
            updateData
        );
        if (!updatedBadge) {
            res.status(404).json({
                success: false,
                message: 'Badge not found',
            });
            return;
        }
        res.status(200).json({ success: true, badge: updatedBadge });
    }

    public async deleteBadge(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this._gamificationService.deleteBadge(id);
        res.status(200).json({
            success: true,
            message: 'Badge deleted successfully',
        });
    }

    public async getGamificationConstants(
        req: Request,
        res: Response
    ): Promise<void> {
        console.log("jajajjd")
        res.status(200).json({
            success: true,
            templates: Object.values(BadgeTemplate),
            triggerEvents: Object.values(GamificationEvent),
            rarities: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
        });
    }
}
