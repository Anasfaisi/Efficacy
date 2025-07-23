import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

interface AuthRequest extends Request{
    user?: {id:string;email:string,role?:string}
}

export const authMiddleware = (req:AuthRequest,res:Response,next:NextFunction)=>{
    const token = req.header("Authorization")?.replace("Bearer","");
    if(!token){
        res.status(401).json({message:"no token provided"})
        return 
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET || "secret")as {id:string;email:string,role:string};
        req.user = decoded;
          if (req.path.startsWith('/admin') && decoded.role !== 'admin') {
              res.status(403).json({ message: 'Admin access required' });
      return 
    }
        next();
    }catch(error){
        res.status(401).json({message:"invalid token"})
    }
}


// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

// interface AdminAuthRequest extends Request {
//     user?: { id: string; email: string; role?: string };
// }

// export const adminAuthMiddleware = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   const refreshToken = req.cookies.refreshToken;

//   if (req.path.includes('/refresh-token')) {
//     if (!refreshToken || !globalThis.refreshTokens.has(refreshToken)) {
//         res.status(401).json({ message: 'Invalid or expired refresh token' });
//       return 
//     }
//     try {
//       const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string; email: string; role: string };
//       if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
//       const accessToken = jwt.sign(
//         { id: decoded.id, email: decoded.email, role: decoded.role },
//         ACCESS_TOKEN_SECRET,
//         { expiresIn: '15m' }
//       );
//       res.json({ accessToken, user: { id: decoded.id, email: decoded.email, role: decoded.role } });
//     } catch (error) {
//       res.status(401).json({ message: 'Invalid refresh token' });
//     }
//     return;
//   }

//   if (!token){ 
//       res.status(401).json({ message: 'Unauthorized' })
//     return
//     };
//   try {
//     const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string; email: string; role: string };
//     if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token expired' });
//   }
// };

