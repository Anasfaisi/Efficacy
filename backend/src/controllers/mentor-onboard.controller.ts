import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorOnboardService } from '@/serivces/Interfaces/IMentor-onboard.service';
import { MentorApplicationRequestDto } from '@/Dto/mentorRequest.dto';
import code from '@/types/http-status.enum';
import {
    ErrorMessages,
    SuccessMessages,
} from '@/types/response-messages.types';

export class MentorOnboardController {
    constructor(
        @inject(TYPES.MentorOnboardService)
        private _mentorOnboardService: IMentorOnboardService
    ) {}

    async mentorApplicationInit(req: Request, res: Response) {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const result = await this._mentorOnboardService.mentorApplicationInit({
            ...req.body,
            id: req.currentUser?.id,
            resume: files?.resume?.[0]?.filename,
            certificate: files?.certificate?.[0]?.filename,
            idProof: files?.idProof?.[0]?.filename,
        });

        res.status(code.OK).json({
            message: SuccessMessages.ApplicationSubmitted,
            result,
        });
    }

    async activateMentor(req: Request, res: Response) {
        const { monthlyCharge } = req.body;
        const mentorId = req.currentUser?.id;

        if (!mentorId) {
            throw new Error(ErrorMessages.MentorIdNotFound);
        }

        const result = await this._mentorOnboardService.activateMentor(
            mentorId,
            monthlyCharge
        );

        res.status(code.OK).json({
            message: SuccessMessages.MentorActivated,
            user: result,
        });
    }
}
