"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractId = void 0;
const extractId = (field) => {
    if (!field)
        return '';
    if (typeof field === 'string')
        return field;
    if (typeof field === 'object') {
        const f = field;
        if (f._id)
            return String(f._id);
        if (typeof f.id === 'string')
            return f.id;
        if (typeof f.toHexString === 'function')
            return f.toHexString();
        if (typeof field.toString === 'function') {
            const s = field.toString();
            if (s !== '[object Object]')
                return s;
        }
    }
    return String(field);
};
exports.extractId = extractId;
//# sourceMappingURL=extractId.js.map