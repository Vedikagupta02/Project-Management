import {Router} from "express"
import {registerUser, loginUser, logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendVerificationEmail} from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator , userLoginValidator, userForgotPassowrdValidator, userResetForgotPasswordValidator, changeCurrentPassowrdValidator} from "../validators/index.js"
import {verifyJWT} from "../middlewares/auth.midddleware.js"
const router=Router()

router.route("/register").post(userRegisterValidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, loginUser)
router.route("/verify-email/:emailVerificationToken").get(verifyEmail)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPassowrdValidator(),validate, forgotPasswordRequest )
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate, resetForgotPassword )

//secure routes for logout
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassowrdValidator(), validate, changeCurrentPassword)

router.route("/resend-email-verification").post(verifyJWT, resendVerificationEmail)
export default router