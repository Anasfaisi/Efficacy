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
exports.BadgeTemplateResolverService = void 0;
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
const inversify_1 = require("inversify");
let BadgeTemplateResolverService = class BadgeTemplateResolverService {
    _templateEvaluator;
    constructor(_templateEvaluator //[new taskevaluator,new pomodoroevaluator]
    ) {
        this._templateEvaluator = _templateEvaluator;
    }
    resolve(templateEvent) {
        const badge = this._templateEvaluator.find((bde) => bde.badgeTemplateEvent == templateEvent);
        if (!badge)
            throw new Error(response_messages_types_1.ErrorMessages.NoEvaluator);
        return badge;
    }
};
exports.BadgeTemplateResolverService = BadgeTemplateResolverService;
exports.BadgeTemplateResolverService = BadgeTemplateResolverService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.multiInject)(inversify_key_types_1.TYPES.IBadgeEvaluator)),
    __metadata("design:paramtypes", [Array])
], BadgeTemplateResolverService);
//# sourceMappingURL=badge-template-resolver.service.js.map