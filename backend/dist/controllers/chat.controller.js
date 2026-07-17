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
exports.ChatController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let ChatController = class ChatController {
    _chatService;
    _socketService;
    constructor(_chatService, _socketService) {
        this._chatService = _chatService;
        this._socketService = _socketService;
    }
    async initiateChat(req, res) {
        const { mentorId } = req.body;
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* Code.UNAUTHORIZED */).json({
                message: response_messages_types_1.ErrorMessages.UserNotFound,
            });
            return;
        }
        const conversation = await this._chatService.initiateChat(userId, mentorId);
        res.status(200 /* Code.OK */).json(conversation);
    }
    async getUserConversations(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* Code.UNAUTHORIZED */).json({
                message: response_messages_types_1.ErrorMessages.UserNotFound,
            });
            return;
        }
        const conversations = await this._chatService.getUserConversations(userId);
        res.status(200 /* Code.OK */).json(conversations);
    }
    // async getRoomMessages(req: Request, res: Response) {
    // const { roomId } = req.params;
    // const userId = req.currentUser?.id;
    // if (!userId) {
    //     res.status(Code.UNAUTHORIZED).json({
    //         message: ErrorMessages.UserNotFound,
    //     });
    //     return;
    // }
    // const messages = await this._chatService.getRoomMessages(
    //     roomId,
    //     userId
    // );
    // res.status(Code.OK).json(messages);
    // }
    async uploadFile(req, res) {
        if (!req.file) {
            res.status(400 /* Code.BAD_REQUEST */).json({
                message: response_messages_types_1.ErrorMessages.NoFileUploaded,
            });
            return;
        }
        const fileUrl = req.file.location;
        res.status(200 /* Code.OK */).json({ url: fileUrl });
    }
    async deleteMessage(req, res) {
        const { messageId } = req.params;
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* Code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const deletedMessage = await this._chatService.deleteMessage(userId, messageId);
        this._socketService.emitToRoom(deletedMessage.conversationId.toString(), 'messageDeleted', { messageId: deletedMessage._id });
        res.status(200 /* Code.OK */).json({ message: response_messages_types_1.SuccessMessages.MessageDeleted });
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ChatService)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.SocketService)),
    __metadata("design:paramtypes", [Object, Object])
], ChatController);
//# sourceMappingURL=chat.controller.js.map