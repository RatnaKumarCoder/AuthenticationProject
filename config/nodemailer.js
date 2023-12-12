//importing nodemailer
const nodemailer=require('nodemailer');
// const ejs=require('ejs');
// const path=require('path');

//configuring a mail transport system with nodemailer and Google as our email service provider
const transport=nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: "ratnakumar22040@gmail.com",
        pass: 'myrp sgqm oxuo mcdb'
    }
});


// let renderTemplate=(data,relativePath)=>{
//     let mailHtml;
//     ejs.renderFile(
//         path.join(_dirname, '../views/mailers',relativePath),
//         data,
//         function(err,template){
//             if(err){
//             console.log('error in rendering template',err)
//             return
//             }
//             mailHtml=template;

//         }
//     );
//     return mailHtml;
// }

//modularizing the transport
module.exports={
    transport: transport
}