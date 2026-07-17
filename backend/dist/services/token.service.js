"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inversify_1 = require("inversify");
let TokenService = class TokenService {
    _accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    _refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    generateAccessToken(userId, role, email) {
        return jsonwebtoken_1.default.sign({ id: userId, role, email }, this._accessTokenSecret, {
            expiresIn: '1d',
        });
    }
    generateRefreshToken(userId, role, email) {
        return jsonwebtoken_1.default.sign({ id: userId, role, email }, this._refreshTokenSecret, {
            expiresIn: '14d',
        });
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this._accessTokenSecret);
    }
    verifyRefreshToken(refreshToken) {
        return jsonwebtoken_1.default.verify(refreshToken, this._refreshTokenSecret);
    }
    generatePasswordResetToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, this._accessTokenSecret, {
            expiresIn: '1d',
        });
    }
    verifyPasswordResetToken(token) {
        const payload = jsonwebtoken_1.default.verify(token, this._accessTokenSecret);
        return payload;
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, inversify_1.injectable)()
], TokenService);
//# sourceMappingURL=token.service.js.map