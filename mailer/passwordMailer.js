//importing configured nodemailer's mail transport system
const nodemailer=require('../config/nodemailer');

//specifying html template to be sent for the user and sending it using nodemailer transport system
exports.newPassword=(user)=>{
    console.log("forgot password mailer");
    nodemailer.transport.sendMail({
        from: "ratnakumar22040@gmail.com",
        to: user.email,
        subject: "Reset Your Password Using the Link",
        html: '<a href="http://localhost:8000/reset_password">Click Here</a> to reset your password'
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('message sent or mail delivered', info);
        return 
    }
    );
}