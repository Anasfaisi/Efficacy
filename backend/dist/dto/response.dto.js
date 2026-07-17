"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedUserResponseDto = exports.UserManagementResponseDto = exports.KanbanTaskResponseDto = exports.KanbanBoardResponseDto = exports.KanbanColumnResponseDto = exports.ProfileResponseDto = exports.MessageResponseDto = exports.CurrentUserResDto = exports.ResponsePaymentDto = exports.RefreshResponseDto = exports.ForgotPasswordVerifyDto = exports.OtpVerificationResponseDto = exports.RegisterInitResponseDto = exports.AdminLoginRespondseDto = exports.userGoogleLoginResponseDto = exports.LoginResponseDTO = void 0;
class LoginResponseDTO {
    accessToken;
    refreshToken;
    user;
    constructor(accessToken, refreshToken, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
    toJSON() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            user: this.user,
        };
    }
}
exports.LoginResponseDTO = LoginResponseDTO;
class userGoogleLoginResponseDto {
    accessToken;
    refreshToken;
    user;
    constructor(accessToken, refreshToken, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
exports.userGoogleLoginResponseDto = userGoogleLoginResponseDto;
class AdminLoginRespondseDto {
    admin;
    accessToken;
    refreshToken;
    constructor(admin, accessToken, refreshToken) {
        this.admin = admin;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
exports.AdminLoginRespondseDto = AdminLoginRespondseDto;
class RegisterInitResponseDto {
    tempEmail;
    role;
    resendAvailableAt;
    constructor(tempEmail, role, resendAvailableAt) {
        this.tempEmail = tempEmail;
        this.role = role;
        this.resendAvailableAt = resendAvailableAt;
    }
}
exports.RegisterInitResponseDto = RegisterInitResponseDto;
class OtpVerificationResponseDto {
    accessToken;
    refreshToken;
    user;
    constructor(accessToken, refreshToken, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
exports.OtpVerificationResponseDto = OtpVerificationResponseDto;
class ForgotPasswordVerifyDto {
    email;
    otp;
    newPassword;
    tempUserId;
    constructor(email, otp, newPassword, tempUserId) {
        this.email = email;
        this.otp = otp;
        this.newPassword = newPassword;
        this.tempUserId = tempUserId;
    }
}
exports.ForgotPasswordVerifyDto = ForgotPasswordVerifyDto;
class RefreshResponseDto {
    success;
    constructor(success) {
        this.success = success;
    }
}
exports.RefreshResponseDto = RefreshResponseDto;
class ResponsePaymentDto {
    sessionId;
    sessionUrl;
    constructor(sessionId, sessionUrl) {
        this.sessionId = sessionId;
        this.sessionUrl = sessionUrl;
    }
}
exports.ResponsePaymentDto = ResponsePaymentDto;
class CurrentUserResDto {
    user;
    constructor(user) {
        this.user = user;
    }
}
exports.CurrentUserResDto = CurrentUserResDto;
/* =======================  Message   ==========================*/
class MessageResponseDto {
    id;
    conversationId;
    senderId;
    content;
    attachments;
    status;
    seenBy;
    createdAt;
    updatedAt;
    constructor(id, conversationId, senderId, content, attachments, status, seenBy, createdAt, updatedAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.attachments = attachments;
        this.status = status;
        this.seenBy = seenBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.MessageResponseDto = MessageResponseDto;
//======================  user profile  =========================//
class ProfileResponseDto {
    id;
    name;
    email;
    role;
    userId;
    subscription;
    bio;
    headline;
    profilePic;
    dob;
    xpPoints;
    badge;
    constructor(id, name, email, role, userId, subscription, bio, headline, profilePic, dob, xpPoints, badge) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.subscription = subscription;
        this.bio = bio;
        this.headline = headline;
        this.profilePic = profilePic;
        this.dob = dob;
        this.xpPoints = xpPoints;
        this.badge = badge;
    }
}
exports.ProfileResponseDto = ProfileResponseDto;
//========================= kanbana board ============================//
class KanbanColumnResponseDto {
    columnId;
    title;
    tasks;
    constructor(columnId, title, tasks) {
        this.columnId = columnId;
        this.title = title;
        this.tasks = tasks;
    }
}
exports.KanbanColumnResponseDto = KanbanColumnResponseDto;
class KanbanBoardResponseDto {
    columns;
    constructor(columns) {
        this.columns = columns;
    }
}
exports.KanbanBoardResponseDto = KanbanBoardResponseDto;
class KanbanTaskResponseDto {
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
exports.KanbanTaskResponseDto = KanbanTaskResponseDto;
class UserManagementResponseDto {
    id;
    name;
    email;
    role;
    isActive;
    profilePic;
    createdAt;
    constructor(id, name, email, role, isActive, profilePic, createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.profilePic = profilePic;
        this.createdAt = createdAt;
    }
}
exports.UserManagementResponseDto = UserManagementResponseDto;
class PaginatedUserResponseDto {
    users;
    totalCount;
    totalPages;
    currentPage;
    constructor(users, totalCount, totalPages, currentPage) {
        this.users = users;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
exports.PaginatedUserResponseDto = PaginatedUserResponseDto;
//# sourceMappingURL=response.dto.js.map