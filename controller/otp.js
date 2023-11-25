import nodemailer, { createTransport } from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js";


let nodeConfig = {
  
    service :'gmail',
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD
    }
}

let transporter = nodemailer.createTransport(nodeConfig);


let MailGenerator = new Mailgen({
  theme :"default",
  product : {
    name: "Mailgen",
    link: 'https://mailgen.js'
  }
})


export const otp = async (req,res)=>{
  const {username, userEmail,text, subject}=req.body;


  var email = {
    body : {
      
      intro :"FireFistAce55  Real Estate",
      outro :text || ""
    }
  }

  var emailbody = MailGenerator.generate(email);
  console.log()


  let massage = {
    from : ENV.EMAIL,
    to : userEmail,
    subject : "password recovery",
    html : emailbody
  }

  transporter.sendMail(massage).then(()=>{
    return res.status(200).send({msg:"email send successfully"})
  }).catch((error)=>{res.status(500).send(error)})



}

export default otp