"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const role_types_1 = require("@/types/role.types");
const response_messages_types_1 = require("@/types/response-messages.types");
class ValidationService {
    validateLoginInput({ email, password, role, }) {
        if (!email || !password) {
            throw new Error(response_messages_types_1.ErrorMessages.EmailPasswordRequired);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidEmail);
        }
        if (password.length < 6) {
            throw new Error(response_messages_types_1.ErrorMessages.PasswordComplexity);
        }
        if (role && role !== role_types_1.Role.User) {
            throw new Error(response_messages_types_1.ErrorMessages.AccessDenied);
        }
    }
    validateRegisterInput({ email, password, name, }) {
        if (!email || !password || !name) {
            throw new Error(response_messages_types_1.ErrorMessages.AllFieldsRequired);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidEmail);
        }
        console.log('email...', email);
        if (password.length < 6) {
            throw new Error(response_messages_types_1.ErrorMessages.PasswordComplexity);
        }
    }
    validateGoogleLoginInput({ role, endpoint, }) {
        if (role &&
            ((endpoint === 'admin' && role !== 'admin') ||
                (endpoint === 'user' && role !== 'user') ||
                (endpoint === 'mentor' && role !== 'mentor'))) {
            throw new Error(`${response_messages_types_1.ErrorMessages.InvalidRoleGoogleLogin} for ${endpoint}`);
        }
        console.log('Successfully validated Google login at backend');
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation.service.js.map