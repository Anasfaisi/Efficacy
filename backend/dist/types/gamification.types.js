"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconType = exports.Rarity = exports.BadgeType = exports.NotifierEvent = exports.GamificationEvent = exports.BadgeTemplate = void 0;
var BadgeTemplate;
(function (BadgeTemplate) {
    BadgeTemplate["TASK_COUNT"] = "TASK_COUNT";
    BadgeTemplate["TASK_STREAK"] = "TASK_STREAK";
    BadgeTemplate["POMODORO_COUNT"] = "POMODORO_COUNT";
    BadgeTemplate["FOCUS_TIME"] = "FOCUS_TIME";
    BadgeTemplate["SESSION_COUNT"] = "SESSION_COUNT";
})(BadgeTemplate || (exports.BadgeTemplate = BadgeTemplate = {}));
var GamificationEvent;
(function (GamificationEvent) {
    GamificationEvent["TASK_COMPLETED"] = "TASK_COMPLETED";
    GamificationEvent["STREAK_UPDATED"] = "STREAK_UPDATED";
    GamificationEvent["POMODORO_COMPLETED"] = "POMODORO_COMPLETED";
    GamificationEvent["FOCUS_TIME_UPDATED"] = "FOCUS_TIME_UPDATED";
    GamificationEvent["SESSION_COMPLETED"] = "SESSION_COMPLETED";
})(GamificationEvent || (exports.GamificationEvent = GamificationEvent = {}));
var NotifierEvent;
(function (NotifierEvent) {
    NotifierEvent["BADGE_UNLOCKED"] = "BADGE_UNLOCKED";
})(NotifierEvent || (exports.NotifierEvent = NotifierEvent = {}));
var BadgeType;
(function (BadgeType) {
    BadgeType["MILESTONE"] = "MILESTONE";
    BadgeType["DAILY"] = "DAILY";
    BadgeType["WEEKLY"] = "WEEKLY";
})(BadgeType || (exports.BadgeType = BadgeType = {}));
var Rarity;
(function (Rarity) {
    Rarity["COMMON"] = "COMMON";
    Rarity["UNCOMMON"] = "UNCOMMON";
    Rarity["RARE"] = "RARE";
    Rarity["EPIC"] = "EPIC";
    Rarity["LEGENDARY"] = "LEGENDARY";
})(Rarity || (exports.Rarity = Rarity = {}));
var IconType;
(function (IconType) {
    IconType["ICON"] = "icon";
    IconType["IMAGE"] = "image";
})(IconType || (exports.IconType = IconType = {}));
//# sourceMappingURL=gamification.types.js.map