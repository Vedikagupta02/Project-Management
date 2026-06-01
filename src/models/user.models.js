import { url } from "inspector";
import mongoose, {Schema} from "mongoose";
import { type } from "os";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

// Define the User schema
const userSchema = new Schema(
    {
        avatar:{
            type:{
                url:String,
                localPath:String

            },
            default:{
                url:`https://ui-avatars.com/api/?name=John+Doe&background=random&size=256`,
                localPath:""
            }
            
        },
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        fullName:{
            type:String,
            trim:true
        },
        password:{
            type:String,
            required:[true,"Password is required"],

        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        },
        forgotPasswordToken:{
            type:String
        },
        forgotPasswordTokenExpiry:{
            type:Date
        },
        emailVerificationToken:{
            type:String
        },
        emailVerificationTokenExpiry:{
            type:Date
        }
    },

    {
        timestamps:true
    },
);

// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function(){
    // Only hash the password if it has been modified (or is new)
    if(!this.isModified("password")){
        return 
    } // Hash the password before saving the user document
    this.password=await bcrypt.hash(this.password,10)
    
});

// Instance method to compare entered password with hashed password in the database
userSchema.methods.isPasswordCorrect= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
   
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        
    )
   
}

userSchema.methods.generateTemporaryToken=function(){
    const unhashedToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex")

    const tokenExpiry = Date.now() + 10 * 60 * 1000

    return {
        unhashedToken,
        hashedToken,
        tokenExpiry
    }

}

export const User=mongoose.model("User",userSchema)