import { TYPES } from '@/config/inversify-key.types';
import { IBadgeService } from '@/serivces/Gamification/interfaces/IBadge.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import Code from '@/types/http-status.enum';
import { CreateBadgeResponseDto } from '@/dto/badge-response.dto';
import { ErrorMessages } from '@/types/response-messages.types';
@injectable()
export class BadgeController {
    constructor(
        @inject(TYPES.BadgeService) private _badgeService: IBadgeService
    ) {}

    public async CreateBadge(req: Request, res: Response): Promise<void> {
        const badgeData = req.body;
        const newBadge = await this._badgeService.createBadge(badgeData);
        res.status(Code.CREATED).json({ success: true, badge: newBadge });
    }

    public async getAllBadges(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 0;
        const result = await this._badgeService.getAllBadges(page, limit);
        res.status(Code.OK).json({ success: true, ...result });
    }

    public async getBadgeById(req: Request, res: Response): Promise<void> {
        const badgeId = req.params.id;
        const badge = await this._badgeService.getBadgeById(badgeId);
        if (!badge) {
            res.status(Code.NOT_FOUND).json({
                status: false,
                message: 'Badge not found',
            });
            return;
        }
        res.status(Code.OK).json({ success: true, badge });
    }

    public async updateBadge(req:Request, res:Response){
        const badgeId = req.params.badgeId;
        const badgeData = req.body
        const updatedBadge = await this._badgeService.updateBadge(badgeId,badgeData)
              if (!updatedBadge) {
            res.status(Code.NOT_FOUND).json({
                success: false,
                message: 'Badge not found',
            });
            return;
        }
        res.status(Code.OK).json({status:true,updatedBadge})
    }

    public async toggleBadgeStatus(req:Request,res:Response){
        const badgeId = req.params.badgeId;
        const status = req.body.status;
        const result = await this._badgeService.toggleBadgeStatus(badgeId,status)
        res.status(Code.OK).json({status:true,badge:result})
    }

    async getUserBadges(req:Request,res:Response){
        const userId = req.currentUser?.id
     if (!userId) {
            res.status(Code.UNAUTHORIZED).json({
                message: ErrorMessages.UserNotFound,

            });
            return
        }
        const result = await this._badgeService.getUserBadges(userId)
        console.log(result,"wanted to see the result")
        res.status(Code.OK).json({status:true,badges:result})
    }
}
