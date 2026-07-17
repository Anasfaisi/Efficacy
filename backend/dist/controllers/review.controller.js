"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
let ReviewController = class ReviewController {
    _reviewService;
    constructor(_reviewService) {
        this._reviewService = _reviewService;
    }
    async submitReview(req, res) {
        const userId = req.currentUser?.id;
        const result = await this._reviewService.submitReview({
            ...req.body,
            userId: userId || req.body.userId,
        });
        res.status(201 /* code.CREATED */).json({
            success: true,
            message: 'Review submitted successfully',
            data: result,
        });
    }
    async getMentorReviews(req, res) {
        const { mentorId } = req.params;
        const result = await this._reviewService.getMentorReviews(mentorId);
        res.status(200 /* code.OK */).json({
            success: true,
            data: result,
        });
    }
};
exports.ReviewController = ReviewController;
exports.ReviewController = ReviewController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ReviewService)),
    __metadata("design:paramtypes", [Object])
], ReviewController);
//# sourceMappingURL=review.controller.js.map