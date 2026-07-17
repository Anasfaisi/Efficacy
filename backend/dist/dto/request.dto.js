"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserStatusRequestDto = exports.reorderKanbanTaskRequestDto = exports.deleteKanbanTaskRequestDto = exports.updateKanbanTaskRequestDto = exports.AddKanbanTaskRequestDto = exports.GetKanbanBoardRequestDto = exports.KanbanBoard = exports.kanbanColumnRequestDto = exports.KanbanTaskRequestDto = exports.ProfilePicUpdateDto = exports.ProfileRequestDto = exports.CreateChatDTO = exports.CreateMessageDTO = exports.CurrentUserReqDto = exports.JoinRoomDto = exports.SendMessageDto = exports.RequestPaymentDto = exports.CreateCheckoutDto = exports.RefreshRequestDto = exports.ResetPasswordrequestDto = exports.ForgotPasswordRequestDto = exports.resendOtpRequestDto = exports.OtpVerificationRequestDto = exports.RegisterRequestDto = exports.userGoogleLoginRequestDto = exports.LoginRequestDto = void 0;
const role_types_1 = require("@/types/role.types");
class LoginRequestDto {
    email;
    password;
    role;
    name;
    constructor(email, password, role, name) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
    }
}
exports.LoginRequestDto = LoginRequestDto;
class userGoogleLoginRequestDto {
    googleToken;
    role;
    constructor(googleToken, role) {
        this.googleToken = googleToken;
        this.role = role;
    }
}
exports.userGoogleLoginRequestDto = userGoogleLoginRequestDto;
class RegisterRequestDto {
    name;
    email;
    password;
    role;
    constructor(name, email, password, role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
exports.RegisterRequestDto = RegisterRequestDto;
class OtpVerificationRequestDto {
    email;
    otp;
    constructor(email, otp) {
        this.email = email;
        this.otp = otp;
    }
}
exports.OtpVerificationRequestDto = OtpVerificationRequestDto;
class resendOtpRequestDto {
    email;
    constructor(email) {
        this.email = email;
    }
}
exports.resendOtpRequestDto = resendOtpRequestDto;
class ForgotPasswordRequestDto {
    email;
    constructor(email) {
        this.email = email;
    }
}
exports.ForgotPasswordRequestDto = ForgotPasswordRequestDto;
class ResetPasswordrequestDto {
    token;
    newPassword;
    constructor(token, newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }
}
exports.ResetPasswordrequestDto = ResetPasswordrequestDto;
class RefreshRequestDto {
}
exports.RefreshRequestDto = RefreshRequestDto;
class CreateCheckoutDto {
    priceId;
    success_url;
    cancel_url;
    customerEmail;
    constructor(priceId, success_url, cancel_url, customerEmail) {
        this.priceId = priceId;
        this.success_url = success_url;
        this.cancel_url = cancel_url;
        this.customerEmail = customerEmail;
        if (!priceId)
            throw new Error('priceId is required');
    }
}
exports.CreateCheckoutDto = CreateCheckoutDto;
class RequestPaymentDto {
    userId;
    priceId;
    successUrl;
    cancelUrl;
    constructor(userId, priceId, successUrl, cancelUrl) {
        this.userId = userId;
        this.priceId = priceId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
    }
}
exports.RequestPaymentDto = RequestPaymentDto;
class SendMessageDto {
    roomId;
    senderId;
    senderName;
    message;
    createdAt;
    constructor(roomId, senderId, senderName, message, createdAt = new Date()) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.message = message;
        this.createdAt = createdAt;
    }
}
exports.SendMessageDto = SendMessageDto;
class JoinRoomDto {
    roomId;
    user;
    constructor(roomId, user) {
        this.roomId = roomId;
        this.user = user;
    }
}
exports.JoinRoomDto = JoinRoomDto;
class CurrentUserReqDto {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.CurrentUserReqDto = CurrentUserReqDto;
/*============================  Message  ===================================*/
class CreateMessageDTO {
    conversationId;
    senderId;
    content;
    attachments;
    constructor(conversationId, senderId, content, attachments) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.attachments = attachments;
    }
}
exports.CreateMessageDTO = CreateMessageDTO;
class CreateChatDTO {
    userA;
    userB;
    constructor(userA, userB) {
        this.userA = userA;
        this.userB = userB;
    }
}
exports.CreateChatDTO = CreateChatDTO;
//============================  user profile ==========================//
class ProfileRequestDto {
    name;
    userId;
    email;
    password;
    role;
    bio;
    headline;
    profilePic;
    dob;
    subscription;
    xpPoints;
    badge;
    currentPassword;
    newPassword;
    constructor(name, userId, email, password, role = role_types_1.Role.User, bio, headline, profilePic, dob, subscription, xpPoints, badge, currentPassword, newPassword) {
        this.name = name;
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.role = role;
        this.bio = bio;
        this.headline = headline;
        this.profilePic = profilePic;
        this.dob = dob;
        this.subscription = subscription;
        this.xpPoints = xpPoints;
        this.badge = badge;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }
}
exports.ProfileRequestDto = ProfileRequestDto;
class ProfilePicUpdateDto {
    file;
    id;
    constructor(file, id) {
        this.file = file;
        this.id = id;
    }
}
exports.ProfilePicUpdateDto = ProfilePicUpdateDto;
//=============================  task  ============================================//
class KanbanTaskRequestDto {
    taskId;
    title;
    description;
    dueDate;
    approxTimeToFinish;
    constructor(taskId, title, description, dueDate, approxTimeToFinish) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.approxTimeToFinish = approxTimeToFinish;
    }
}
exports.KanbanTaskRequestDto = KanbanTaskRequestDto;
class kanbanColumnRequestDto {
    columnId;
    title;
    tasks;
    constructor(columnId, title, tasks = []) {
        this.columnId = columnId;
        this.title = title;
        this.tasks = tasks;
    }
}
exports.kanbanColumnRequestDto = kanbanColumnRequestDto;
class KanbanBoard {
    columns;
    constructor(columns) {
        this.columns = columns;
    }
}
exports.KanbanBoard = KanbanBoard;
class GetKanbanBoardRequestDto {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.GetKanbanBoardRequestDto = GetKanbanBoardRequestDto;
class AddKanbanTaskRequestDto {
    id;
    columnId;
    task;
    constructor(id, columnId, task) {
        this.id = id;
        this.columnId = columnId;
        this.task = task;
    }
}
exports.AddKanbanTaskRequestDto = AddKanbanTaskRequestDto;
class updateKanbanTaskRequestDto {
    id;
    taskId;
    columnId;
    data;
    constructor(id, taskId, columnId, data) {
        this.id = id;
        this.taskId = taskId;
        this.columnId = columnId;
        this.data = data;
    }
}
exports.updateKanbanTaskRequestDto = updateKanbanTaskRequestDto;
class deleteKanbanTaskRequestDto {
    id;
    columnId;
    taskId;
    constructor(id, columnId, taskId) {
        this.id = id;
        this.columnId = columnId;
        this.taskId = taskId;
    }
}
exports.deleteKanbanTaskRequestDto = deleteKanbanTaskRequestDto;
class reorderKanbanTaskRequestDto {
    id;
    taskId;
    sourceColumnId;
    destColumnId;
    sourceTaskIndex;
    destTaskIndex;
    constructor(id, taskId, sourceColumnId, destColumnId, sourceTaskIndex, destTaskIndex) {
        this.id = id;
        this.taskId = taskId;
        this.sourceColumnId = sourceColumnId;
        this.destColumnId = destColumnId;
        this.sourceTaskIndex = sourceTaskIndex;
        this.destTaskIndex = destTaskIndex;
    }
}
exports.reorderKanbanTaskRequestDto = reorderKanbanTaskRequestDto;
class UpdateUserStatusRequestDto {
    userId;
    isActive;
    constructor(userId, isActive) {
        this.userId = userId;
        this.isActive = isActive;
    }
}
exports.UpdateUserStatusRequestDto = UpdateUserStatusRequestDto;
//# sourceMappingURL=request.dto.js.map