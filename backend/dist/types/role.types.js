"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["User"] = "user";
    Role["Mentor"] = "mentor";
    Role["Admin"] = "admin";
})(Role || (exports.Role = Role = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
//# sourceMappingURL=role.types.js.map