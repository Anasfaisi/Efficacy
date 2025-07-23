import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
        return res.status(401).json({ message: "no token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "invalid token" });
    }
};
