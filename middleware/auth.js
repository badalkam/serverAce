import jwt from "jsonwebtoken";
import ENV from "../config.js";

export default async function Auth(req, res, next) {
  try {
    // access autherize header to validate request
    const token = req.headers.authorization.split(" ")[1];
    //    retrive the user detailed of logged in user
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).send({ error: "Authendication Failed" });
  }
}

export function localVeriables(req,res,next){
  req.app.locals={
    OTP:null,
    resetSession :false
  }
  next()
}
