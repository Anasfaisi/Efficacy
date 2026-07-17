"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToGamificationEvent = exports.emitGamificationEvent = exports.eventBus = void 0;
const events_1 = require("events");
class GamificationEventBus extends events_1.EventEmitter {
}
exports.eventBus = new GamificationEventBus();
const emitGamificationEvent = (event, payload) => {
    exports.eventBus.emit(event, payload);
};
exports.emitGamificationEvent = emitGamificationEvent;
const subscribeToGamificationEvent = (event, listener) => {
    exports.eventBus.on(event, listener);
};
exports.subscribeToGamificationEvent = subscribeToGamificationEvent;
//# sourceMappingURL=eventBus.js.map