import {User} from "../models/user.models.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ProjectMember } from "../models/projectmember.models.js"
import mongoose from "mongoose"
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

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "project id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(400, "project not found");
    }

    const givenRole = project.role;

    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }

    next();
  });
};