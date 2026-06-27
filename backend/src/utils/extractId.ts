export const extractId = (
    field: string | { id?: string; _id?: unknown } | unknown
): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;

    if (typeof field === 'object') {
        const f = field as {
            id?: unknown;
            _id?: unknown;
            toHexString?: () => string;
        };

        if (f._id) return String(f._id);

        if (typeof f.id === 'string') return f.id;

        if (typeof f.toHexString === 'function') return f.toHexString();

        if (
            typeof (field as { toString: () => string }).toString === 'function'
        ) {
            const s = (field as { toString: () => string }).toString();
            if (s !== '[object Object]') return s;
        }
    }

    return String(field);
};
