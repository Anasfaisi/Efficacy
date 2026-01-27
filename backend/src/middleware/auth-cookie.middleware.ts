import { Response } from 'express';

class AuthCookieMiddleware {
    static setAuthcookies(
        res: Response,
        accessToken: string,
        refreshToken: string
    ) {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    static clearAuthCookies(res: Response) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    }
}

export default AuthCookieMiddleware;
