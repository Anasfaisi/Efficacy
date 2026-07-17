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
exports.MentorshipController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
let MentorshipController = class MentorshipController {
    _mentorshipService;
    constructor(_mentorshipService) {
        this._mentorshipService = _mentorshipService;
    }
    async createRequest(req, res) {
        const userId = req.currentUser.id;
        const { mentorId, sessions, proposedStartDate } = req.body;
        const mentorship = await this._mentorshipService.createRequest(userId, mentorId, sessions, proposedStartDate);
        res.status(201 /* code.CREATED */).json(mentorship);
    }
    async getMentorRequests(req, res) {
        const mentorId = req.currentUser.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const requests = await this._mentorshipService.getMentorRequests(mentorId, page, limit, status, search);
        res.status(200 /* code.OK */).json(requests);
    }
    async getUserRequests(req, res) {
        const userId = req.currentUser.id;
        const requests = await this._mentorshipService.getUserRequests(userId);
        res.status(200 /* code.OK */).json(requests);
    }
    async respondToRequest(req, res) {
        const mentorId = req.currentUser.id;
        const { id } = req.params;
        const { status, suggestedStartDate, reason } = req.body;
        const mentorship = await this._mentorshipService.respondToRequest(id, mentorId, status, suggestedStartDate, reason);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async confirmSuggestion(req, res) {
        const userId = req.currentUser.id;
        const { id } = req.params;
        const { confirm } = req.body;
        const mentorship = await this._mentorshipService.confirmMentorSuggestion(id, userId, confirm);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async verifyPayment(req, res) {
        const { id } = req.params;
        const { paymentId } = req.body;
        const mentorship = await this._mentorshipService.verifyPayment(id, paymentId);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async getActiveMentorship(req, res) {
        const userId = req.currentUser.id;
        const mentorship = await this._mentorshipService.getActiveMentorship(userId);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async getMentorshipById(req, res) {
        const { id } = req.params;
        const mentorship = await this._mentorshipService.getMentorshipById(id);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async bookSession(req, res) {
        const userId = req.currentUser.id;
        const { id } = req.params;
        const { date, slot } = req.body;
        const mentorship = await this._mentorshipService.bookSession(id, userId, date, slot);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async rescheduleSession(req, res) {
        const { id } = req.params;
        const { sessionId, newDate, newSlot } = req.body;
        const mentorship = await this._mentorshipService.rescheduleSession(id, sessionId, newDate, newSlot);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async completeMentorship(req, res) {
        const { id } = req.params;
        const { role } = req.body;
        const mentorship = await this._mentorshipService.completeMentorship(id, role);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async submitFeedback(req, res) {
        const { id } = req.params;
        const { role, rating, comment } = req.body;
        const mentorship = await this._mentorshipService.submitFeedback(id, role, rating, comment);
        res.status(200 /* code.OK */).json(mentorship);
    }
    async cancelMentorship(req, res) {
        const userId = req.currentUser.id;
        const { id } = req.params;
        const mentorship = await this._mentorshipService.cancelMentorship(id, userId);
        res.status(200 /* code.OK */).json(mentorship);
    }
};
exports.MentorshipController = MentorshipController;
exports.MentorshipController = MentorshipController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorshipService)),
    __metadata("design:paramtypes", [Object])
], MentorshipController);
//# sourceMappingURL=mentorship.controller.js.map