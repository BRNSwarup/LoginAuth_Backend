
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: process.env.ADMIN_MAIL,
    pass: process.env.APP_PASSWORD,
  },
  });

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const currentOTP = {};

export const sendEMail = async (email,otp) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const otpstatus= await transporter.sendMail({
            from: process.env.ADMIN_MAIL,
            to: email,
            subject: "Reset Password",
            html: `<h1>To reset Password enter OTP ${otp} </h1>`, // HTML version of the message
        })
        // console.log("line27",otpstatus)
        resolve("OTP send")
        } catch (error) {
            reject("OTP not send")
        }
  });
}


const JWTAccessToken="thisisaccesstoken"

export function generateJWT(user) {
    return jwt.sign(user,JWTAccessToken,{
        expiresIn:'15min'
    })
}

export const JWTAccessTokenverification = (req,res,next)=>{
    let reqHeader = req.headers['authorization']
    if (!reqHeader) {
        res.status(404).json({message:"Not found"})
    }

    let token = reqHeader.split(" ")[1];
    jwt.verify(token,JWTAccessToken,(err,user)=>{
        if (err) {
            res.status(404).json({message:"Not found or token missmatch"})
        }
        req.user=user;
        next();
    })
}
