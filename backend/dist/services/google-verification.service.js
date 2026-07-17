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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVerificationService = void 0;
const google_auth_library_1 = require("google-auth-library");
const inversify_1 = require("inversify");
let GoogleVerificationService = class GoogleVerificationService {
    _client;
    constructor() {
        this._client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async verify(googleToken) {
        return this._client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    }
};
exports.GoogleVerificationService = GoogleVerificationService;
exports.GoogleVerificationService = GoogleVerificationService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], GoogleVerificationService);
//# sourceMappingURL=google-verification.service.js.map