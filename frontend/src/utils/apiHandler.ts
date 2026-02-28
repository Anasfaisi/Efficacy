import { toast } from 'sonner';

/**
 * A wrapper to handle API requests without repetitive try-catch blocks.
 * Automatically handles error toasts and optional success toasts.
 *
 * @param promise The API call promise
 * @param successMsg Optional message to show on success
 * @returns The data from the promise, or null if it failed
 */
export const requestWrapper = async <T>(
    promise: Promise<T>,
    successMsg?: string
): Promise<T | null> => {
    try {
        const response = await promise;
        if (successMsg) {
            toast.success(successMsg);
        }
        return response;
    } catch (error) {
        console.error('API Request Error:', error);

        const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (error as Error)?.message ||
            'An unexpected error occurred';

        toast.error(errorMessage);
        return null;
    }
};
