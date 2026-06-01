import {User} from "../models/user.models.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import jwt from "jsonwebtoken"
export const verifyJWT = asyncHandler(async(req, res, next)=>{
    const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "")
    
    if(!token){
        throw new ApiError(401, "Unauthorized: No token provided")
    }

    try{
        const decoded=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user=await User.findById(decoded._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry")

        if(!user){
            throw new ApiError(404, "Invalid token: User not found")
        }

        req.user=user
        next()
    }
    
        catch(err){
            console.log("JWT ERROR:", err.message)

            throw new ApiError(
                401,
                err.message
            )
            }
    
})