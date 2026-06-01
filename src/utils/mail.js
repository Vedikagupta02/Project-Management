import mailgen from "mailgen";
import nodemailer from "nodemailer";
import { act } from "react";

const sendEmail = async (options)=>{
    const mailgenerator=new mailgen({
        theme:"default",
        product:{
            name:"Project Management App",
            link:"https://project-management-app.com"
        }
    })

    const emailTextual=mailgenerator.generatePlaintext(options.mailgenContent)
    const emailHtml=mailgenerator.generate(options.mailgenContent)

    const transporter=nodemailer.createTransport({
        host:process.env.MAIL_TRAP_SMTP_HOST,
        port:process.env.MAIL_TRAP_SMTP_PORT,
        auth:{
            user:process.env.MAIL_TRAP_SMTP_USER,   
            pass:process.env.MAIL_TRAP_SMTP_PASSWORD
        }
    })

    const mail={
        from:"mail@project-management-app.com",
        to:options.to,
        subject:options.subject,
        text:emailTextual,
        html:emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }
    catch(error){
        console.error("Error sending email:",error)
    }

}

const emailverificationTemplate = (username, verificationURL)=>{
    return {
        body:{
            name:username,
            intro:"Welcome to Project Management App! We're very excited to have you on board.",
            action:{
                instructions:"To get started with your account, please click here:",
                button:{
                    color:"#22BC66",
                    text:"Verify your email",
                    link:verificationURL
                },
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

const forgotPasswordTemplate = (username, resetURL)=>{
    return {
        body:{
            name:username,
            intro:"You have requested to reset your password.",
            action:{
                instructions:"To get started with your account, please click here:",
                button:{
                    color:"#22BC66",
                    text:"Reset your password",
                    link:resetURL
                },
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export {emailverificationTemplate, forgotPasswordTemplate, sendEmail}