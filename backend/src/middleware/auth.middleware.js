import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        // console.log("Cookies:", req.cookies);

        if(!token){
            return res.status(401).json({message: "UnAuthorized Access - No cookie is provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Decoded JWT:", decoded);
        if(!decoded){
            return res.status(401).json({message: "UnAuthorized Access - Invalid JWT Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");
        // console.log("User found in DB:", user);
        if(!user){
            return res.status(401).json({message: "UnAuthorized Access - User not Found"})
        }

        req.user = user
        next();

    } catch (error) {
        console.log("Error in Protect Route Middleware", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}