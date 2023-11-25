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


export const registerMail = async (req,res)=>{
  const {username, userEmail,text, subject}=req.body;


  var email = {
    body : {
      name : username,
      intro : text||"welocome to FireFistAce55  Real Estate",
      outro :"FireFistAce55  Real Estate"
    }
  }

  var emailbody = MailGenerator.generate(email);
  console.log()


  let massage = {
    from : ENV.EMAIL,
    to : userEmail,
    subject : subject,
    html : emailbody
  }

  transporter.sendMail(massage).then(()=>{
    return res.status(200).send({msg:"email send successfully"})
  }).catch((error)=>{res.status(500).send(error)})



}

export default registerMail