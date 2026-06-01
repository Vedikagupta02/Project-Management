import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";

import {ApiResponse} from "../utils/api-response.js"

import {asyncHandler} from "../utils/async-handler.js"

import { sendEmail, emailverificationTemplate } from "../utils/mail.js";

const generateAccessandRefreshToken = async (userID) =>{
    try{
        const user=await User.findById(userID)

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken, refreshToken}
    }
    catch(err){
        throw new ApiError(500, "Error generating tokens", [], err.stack)
    }
}

export const loginUser = asyncHandler(async(req, resp)=>{

    const {email, username, password}=req.body

    if(!email ){
        throw new ApiError(400, "Please provide email ")
    }

    const user=await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } =
   await generateAccessandRefreshToken(user._id)

    const loggedInUSer= await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry")

    const options={
        httpOnly:true,
        secure:true
    }

    return resp.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUSer, accessToken, refreshToken}, "Logged in successfully"))

    

})
export const registerUser = asyncHandler(async(req, resp)=>{

    const {email, username, password, role}=req.body

    const existingUser=await User.findOne({$or:[{email},{username}]})

    if(existingUser){
        throw new ApiError(409,"User with this email or username already exists")
    }

    const user=await User.create({email, password, username, isEmailVerified:false, role})

    const {unhashedToken,
        hashedToken,
        tokenExpiry}=user.generateTemporaryToken()

        user.emailVerificationToken=hashedToken
        user.emailVerificationTokenExpiry=tokenExpiry

    await user.save({validateBeforeSave:false})

    await sendEmail({
        to: user.email,
        subject: "Verify your email",
        mailgenContent: emailverificationTemplate(user.username, `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?token=${unhashedToken}`)
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry")

    if(!createdUser){
        throw new ApiError(500, "Error creating user")
    }

    resp.status(201).json(
        new ApiResponse(201, {user: createdUser}, "User created successfully")
    )
})

export const logoutUser=asyncHandler(async(req, resp)=>{

    await User.findByIdAndUpdate(req.user._id, { $set:{refreshToken: ""}}, {new:true})

    const options={
        httpOnly:true,
        secure:true
    }

    return resp.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "Logged out successfully"))



})

export const getCurrentUser = asyncHandler(async(req, resp)=>{
    return resp.status(200).json(new ApiResponse(200, {user: req.user}, "Current user fetched successfully"))
})

export const verifyEmail = asyncHandler(async(req, resp)=>{
    const {emailVerificationToken}=req.params

    if(!emailVerificationToken){
        throw new ApiError(400, "Verification token is required")
    }

    let hashedToken=crypto.createHash("sha256").update(emailVerificationToken).digest("hex")

    const user=await User.findOne({emailVerificationToken: hashedToken, emailVerificationTokenExpiry: {$gt: Date.now()}})

    if(!user){
        throw new ApiError(400, "Invalid or expired verification token")
    }

    user.isEmailVerified=true
    await user.save({validateBeforeSave:false})
    user.emailVerificationToken=undefined
    user.emailVerificationTokenExpiry=undefined
    

    return resp.status(200).json(new ApiResponse(200, {isEmailVerified: true}, "Email verified successfully"))
})

export const resendVerificationEmail = asyncHandler(async(req, resp)=>{
    const user=await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404, "User not found")
    }
    if(user.isEmailVerified){
        throw new ApiError(400, "Email is already verified")
    }
    

    const {unhashedToken,
        hashedToken,
        tokenExpiry}=user.generateTemporaryToken()

        user.emailVerificationToken=hashedToken
        user.emailVerificationTokenExpiry=tokenExpiry

    await user.save({validateBeforeSave:false})

    await sendEmail({
        to: user.email,
        subject: "Verify your email",
        mailgenContent: emailverificationTemplate(user.username, `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?token=${unhashedToken}`)
    })

    return resp.status(200).json(new ApiResponse(200, null, "Verification email resent successfully"))


})

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token in expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail id",
      ),
    );
});

export const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, "Token is invalid or expired");
  }

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});