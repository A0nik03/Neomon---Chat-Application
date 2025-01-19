import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const ProtectedRoute = async(req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Token not provided" });
        }

        const decoded = jwt.verify(token,process.env.SECRET_KEY);

        if(!decoded){
            return res.status(403).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in ProtectRoute Middleware");
        return res.status(500).json({ message: "Internal Server Error" });
    }
}