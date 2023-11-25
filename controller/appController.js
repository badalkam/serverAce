import UserModel from "../model/User.model.js";
import PropertyModel from "../model/Property.model.js";
import bcrypt from "bcrypt";
import jwd from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";
import localVeriables from "../middleware/auth.js"
import { json } from "express";


export async function register(req, res) {
  try {
    const { username, password, email, profile } = req.body;
    //check for user exist
    const existUser = new Promise((resolve,reject)=>{
      
      UserModel.findOne({username},function(err,user){
        if(err) reject(res.send(err))
        if (user) {
          reject({ error: "username already exit use unique username" })
        }

        resolve()
      })
    })

    const existEmail = new Promise((resolve,reject)=>{
      
      UserModel.findOne({email},function(err,user){
        if(err) reject(res.send(err))
        if (user) {
          reject({ error: "email already exit use unique email" })
        }

        resolve()
      })
    })
    //check for email


    Promise.all([existUser, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const employees = new UserModel({
                username,
                password: hashedPassword,
                email,
                profile,
              });
              // return save  result as responce
              employees
                .save()
                .then((result) => {
                  res.status(201).send({ msg: "user save successfully" });
                })
                .catch((error) => {
                  res.status(500).send({ error: "user not save successfully" });
                });
            })
            .catch((error) => {
              return res.status(500).send({ error: "Enble to hash password" });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error: "Enble to promise all method" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function login1(req, res) {
  try {
    const { username, password } = res.body;

    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(404).send({ error: "Don't have password" });
            }
            //  create jwt Tocken
            const token = jwd.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login Succussfully",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(404).send({ error: "password not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function deleteUser(req, res,next) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(501).send({ error: "invalid username" });
    }
    UserModel.deleteOne({ username }, function (err, user) {
      if (err) return res.status(501).send(err);
      if (!user)
        return res.status(501).send({ error: "Could'n Find the  username" });
      // remove password and remove unnecessary data from responce

      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
      next()
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getUser(req, res,next) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(501).send({ error: "invalid username" });
    }
    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(501).send(err);
      if (!user)
        return res.status(501).send({ error: "Could'n Find the  username" });
      // remove password and remove unnecessary data from responce

      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
      next()
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getProperties(req, res,next) {
  try {
    const { username } = req.params;
    // if (!username) {
    //   return res.status(501).send({ error: "invalid username" });
    // }
    PropertyModel.find({ username }, function (err, user) {
      if (err) return res.status(501).send(err);
      if (!user)
        return res.status(501).send({ error: "Could'n Find the  Properties" });
      // remove password and remove unnecessary data from responce

      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
      next()
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function login(req, res) {
  try {
    const { username, password, email, profile } = req.body;

    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(404).send({ error: "Don't have password" });
            }

            //jwt token
            const token = jwd.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(201).send({
              msg: "Login Succussfully",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(404).send({ error: "password not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function generateOTP(req, res) {

    res.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
    res.status(201).send({code:res.app.locals.OTP}) 
  

}

export async function verifyOTP(req, res) {
  const {code} = req.query;
  if(parseInt(res.app.locals.OTP)===parseInt(code)){
    res.app.locals.OTP = null, // reset OTP to null
    res.app.locals.resetSession=true; // create session or reset password
    return res.status(201).send({msg:"Verify OTP successully"})
  }
  return res.status(400).send({error:" OTP Verification Failed"})
}

export async function createResetSession(req, res) {
 if(res.app.locals.resetSession){
  res.app.locals.resetSession =false;
  return res.status(201).send({msg:"access granded"})
 }
 return res.status(440).send({error:"Session exprired"})
}

export async function verifyUser(req, res,next) {
  try {
    // const {username}= res.method == "GET" ? req.query:req.body;
    if(req.method=="GET"){
     const {username} = req.query;
      let exist = await UserModel.findOne({username})
      if(exist){return res.status(200).send({msg:"user exit"})}
    if(!exist){return res.status(404).send({error:"Can't Find User"})}
    return {exist}
    next()
    }
    if(req.method=="POST"){
     const{username}  = req.body;
     let exist = await UserModel.findOne({username})
     if(exist){return res.status(200).send({msg:"user exit"})}
    if(!exist){return res.status(404).send({error:"Can't Find User"})}
    next()
     
    }
    if(req.method=="PUT"){
      const{username}  = req.body;
      let exist = await UserModel.findOne({username})
     if(!exist){return res.status(404).send({error:"Can't Find User"})}
     next()
      
     }
    
  } catch (error) {
    return res.status(404).send({error:"Authentication Failed"})
  }
}

export async function updateuser(req, res) {
  try {

    const {userId}=req.user;
    if (userId) {
      const body = req.body;
      // Update data
      UserModel.updateOne({_id:userId},body,function(err,data){
         return res.status(201).send({msg:"Record Successfully"})
      })
      
    } else {
      return res.status(500).send({error:"user not found"});
    }
    
  } catch (error) {
    return res.status(500).send(error);
    
  }
}

export async function UpdateProperty(req, res) {
  try {

   const {id} =req.params
    if (id) {
      const body = req.body;
      // Update data
      PropertyModel.findByIdAndUpdate(id,body,function(err,data){
         return res.status(201).send({msg:"Record Successfully"})
      })
      
    } else {
      return res.status(500).send({error:"user not found"});
    }
    
  } catch (error) {
    return res.status(500).send(error);
    
  }
}

export async function resetPassword(req, res) {
  try {
    if(!req.app.locals.resetSession){return res.status(440).send({error:"Session exprired"})}
    const { username , password}= req.body;

    try {
      UserModel.findOne({username})
      .then((user)=>{
        bcrypt.hash(password,10)
        .then((hashedPassword)=>{
          UserModel.updateOne({username:user.username},{password :hashedPassword},function(err,data){
            if(err) throw err;
            res.app.locals.resetSession =false;// reset the session
            return res.status(201).send({msg:"record updated"})
          })
        })
        .catch((error)=>{return res.status(500).send({error:"enble hashed password"})})
      })
      .catch((error)=>{return res.status(404).send({error:"Username not found"})})
      
    } catch (error) {
      return res.status(500).send(error)
    }



    
  } catch (error) {
    return res.status(401).send(error)
  }
}

export async function authenticate(req, res,next) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(501).send({ error: "invalid username" });
    }
    let exist = await UserModel.findOne({username})
      if(exist){return res.status(200).send({msg:"user exit"})}
    if(!exist){return res.status(404).send({error:"Can't Find User"})}
    next()
    
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function CreateProperty(req, res) {
  try {
    const {propertyname,address,about,bhk1,bhk2,bhk3,sell,rent,photo,username,price} = req.body
    // res.status(201).send({ msg: "user save successfully" });
    
    const property = new PropertyModel({
      propertyname ,
      address ,
      about,
      bhk1 ,
      bhk2 ,
      bhk3 ,
      sell ,
      rent , 
      photo, 
      username,
      price,
    })
    property.save().then((result)=>{
      
      res.status(201).send({ msg: "user save successfully" });
    }).catch((error)=>{
      res.status(500).send({ error: "user not save successfully" });
    })


  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function searchProperty(req, res) {
  try {
    const { propertyname,bhk1,bhk2,bhk3,sell,rent} = req.query;
    if (propertyname=="") {
      // return res.status(201).send({ error: "plz enter propertyname" });
    }
    PropertyModel.find({propertyname,rent,sell,bhk1,bhk2,bhk3}, function (err, properties) {
      if (err) return res.status(501).send(err);
      if (!properties)
        return res.status(501).send({ error: "search object not found in database" });
      // remove password and remove unnecessary data from responce

      const { photo, ...rest } = properties
      

      return res.status(201).send(rest);
      
     
    })

  
  } catch (error) {
    return res.status(500).send(error);
  }

}

export async function searchPropertyByUsername(req, res) {
  try {
    const { username} = req.params;
    
    PropertyModel.find({username}, function (err, properties) {
      if (err) return res.status(501).send(err);
      if (!properties)
        return res.status(501).send({ error: "search object not found in database" });
      // remove password and remove unnecessary data from responce

      const { photo, ...rest } = properties
      

      return res.status(201).send(rest);
      
     
    })

  
  } catch (error) {
    return res.status(500).send(error);
  }

}

export async function searchPropertyById(req, res) {
  try {
    const { id} = req.params;
    
    PropertyModel.findById({_id:id}, function (err, properties) {
      if (err) return res.status(501).send(err);
      if (!properties)
        return res.status(501).send({ error: "search object not found in database" });
      // remove password and remove unnecessary data from responce

      const { _doc, ...rest } = properties
      

      return res.status(201).send(properties);
      
     
    })

  
  } catch (error) {
    return res.status(500).send(error);
  }

}

export async function deteleProperty(req, res) {

  const {userId}=req.user;
  if (userId) {
    
  try {
    const  {id} = req.params;
    
    PropertyModel.findByIdAndDelete({_id:id}, function (err, properties) {
      if (err){ return res.status(501).send(err)} 
      else{
        res.status(201).send({msg:"property deleted successfully"})
      }
    })
  } catch (error) {
    return res.status(500).send(error);
  } 
  } else {
    res.status(201).send({msg:"Autherization Failed"})
  }
}

export async function updatePropertyById(req, res) {

  const {userId}=req.user;
  if (userId) {
    
  try {
    const responce = req.body; 
    const  {id} = req.params;
    
    PropertyModel.updateOne({_id:id},responce, function (err, properties) {
      if (err){ return res.status(501).send(err)} 
      else{
        res.status(201).send({msg:"property update successfully"})
      }
    })
  } catch (error) {
    return res.status(500).send(error);
  } 
  } else {
    res.status(201).send({msg:"Autherization Failed"})
  }
}

export async function searchSellProperty(req, res) {
  try {
 
 
    PropertyModel.find({}, function (err, properties) {
      if (err) return res.status(501).send(err);
      if (!properties)
        return res.status(501).send({ error: "Could'n Find the  username" });
      // remove password and remove unnecessary data from responce
      const { photo, ...rest } = properties
      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(500).send(error);
  }

}











