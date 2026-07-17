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
exports.SocketService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
const booking_status_types_1 = require("@/types/booking-status.types");
const logMiddlewares_1 = require("@/utils/logMiddlewares");
const message_type_types_1 = require("@/types/message-type.types");
let SocketService = class SocketService {
    _chatService;
    _bookingRepository;
    _io = null;
    constructor(_chatService, _bookingRepository) {
        this._chatService = _chatService;
        this._bookingRepository = _bookingRepository;
    }
    register(io) {
        this._io = io;
        io.on('connection', (socket) => {
            socket.on('joinUserRoom', (userId) => {
                socket.join(userId);
                logMiddlewares_1.logger.info(`Socket ${socket.id} joined notification room: ${userId}`);
            });
            socket.on('joinRoom', (payload) => this.handleJoinRoom(socket, payload));
            socket.on('sendMessage', (payload) => this.handleSendMessage(io, socket, payload));
            socket.on('joinVideoRoom', async ({ roomId, userId, role, }) => {
                const booking = await this._bookingRepository.findById(roomId);
                const hasAccess = booking &&
                    (booking.userId.toString() === userId ||
                        booking.mentorId.toString() === userId) &&
                    booking.status === booking_status_types_1.BookingStatus.CONFIRMED;
                if (!hasAccess) {
                    console.log(`Access denied for ${userId} to Room ${roomId}`);
                    socket.emit('error', {
                        message: 'Unauthorized access to video room',
                    });
                    return;
                }
                logMiddlewares_1.logger.info(`Socket ${socket.id} joined Video Room: ${roomId} as ${role}`);
                socket.join(roomId);
                socket.to(roomId).emit('user-connected', {
                    userId,
                    role,
                    socketId: socket.id,
                });
                if (role === 'mentor') {
                    io.to(roomId).emit('host-online');
                }
            });
            socket.on('signal', (data) => {
                io.to(data.to).emit('signal', {
                    signal: data.signal,
                    from: data.from,
                });
            });
            socket.on('check-video-status', (roomId, callback) => {
                const room = io.sockets.adapter.rooms.get(roomId);
                const isActive = room ? room.size > 0 : false;
                callback({ active: isActive });
            });
            socket.on('disconnect', () => {
                console.log('Socket Disconnected:', socket.id);
            });
        });
    }
    emitToRoom(roomId, event, data) {
        if (this._io) {
            this._io.to(roomId).emit(event, data);
        }
    }
    async emitNotification(userId, notification) {
        if (this._io) {
            this._io.to(userId).emit('newNotification', notification);
        }
    }
    async handleJoinRoom(socket, { roomId, userId }) {
        try {
            const canJoin = await this._chatService.validateRoomAccess(roomId, userId);
            if (!canJoin) {
                socket.emit('error', { message: response_messages_types_1.ErrorMessages.AccessDenied });
                return;
            }
            socket.join(roomId);
            const history = await this._chatService.getRoomMessages(roomId, userId);
            socket.emit('chatHistory', history);
        }
        catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: response_messages_types_1.ErrorMessages.JoinChatRoomFailed });
        }
    }
    async handleSendMessage(io, socket, payload) {
        try {
            console.log(payload, 'from socket. service');
            const { roomId, senderId, content, type = message_type_types_1.MessageType.TEXT, } = payload;
            const savedMessage = await this._chatService.sendMessage(senderId, roomId, content, type);
            io.to(roomId).emit('receiveMessage', savedMessage);
        }
        catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', {
                message: error instanceof Error
                    ? error.message
                    : response_messages_types_1.ErrorMessages.SendMessageFailed,
            });
        }
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ChatService)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BookingRepository)),
    __metadata("design:paramtypes", [Object, Object])
], SocketService);
//# sourceMappingURL=socket.service.js.map