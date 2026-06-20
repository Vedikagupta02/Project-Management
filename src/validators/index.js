import {body} from "express-validator"
import {AvailableUserRole} from "../utils/constants.js"

const userRegisterValidator=function(){
    return [
        body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email address"),
        body("username").trim().notEmpty().withMessage("Username is required").isLowercase().withMessage("Username must be in lowercase").isLength({min:3}).withMessage("Username must be at least 3 characters long"),
        body("password").trim().notEmpty().withMessage("Password is required").isLength({min:6}).withMessage("Password must be at least 6 characters long")
    ]

}

const userLoginValidator=function(){
    return [
        body("email").optional().trim().isEmail().withMessage("Please provide a valid email address"),
        body("username").optional().trim().isLowercase().withMessage("Username must be in lowercase").isLength({min:3}).withMessage("Username must be at least 3 characters long"),
        body("password").trim().notEmpty().withMessage("Password is required")
    ]

}

const changeCurrentPassowrdValidator=()=>{
    return[
        body("oldPassword").notEmpty().withMessage("Old password is required"),

        body("newPassword").notEmpty().withMessage("new password required")
    ]
}

const userForgotPassowrdValidator=()=>{
    return[
        body("email").notEmpty().withMessage("email is required").isEmail().withMessage("Email is invalid")

    ]
}

const userResetForgotPasswordValidator=()=>{
    return [
        body("newPassword").notEmpty().withMessage("password is required")
    ]
}

const createProjectValidator=()=>{
    return [
        body("name").notEmpty().withMessage("Project name is required"),
        body("description").optional(),
    ]
}

const addMemberToProjectValidator=()=>{
    return [
        body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("Email is invalid"),
        body("role").notEmpty().withMessage("Role is required").isIn(AvailableUserRole).withMessage("Role must be admin, project_admin, or member")
    ]
}
export { userRegisterValidator, 
    userLoginValidator , 
    changeCurrentPassowrdValidator, 
    userForgotPassowrdValidator, 
    userResetForgotPasswordValidator, 
    createProjectValidator,
    addMemberToProjectValidator}

