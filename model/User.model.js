import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username :{
        type: String,
        required : [true,"please provide unique Username"],
        unique :[true,"Username Exit"]
    },
    password :{
        type: String,
        required : [true,"please provide unique password"],
        unique :false
    },
    email :{
        type: String,
        required : [true,"please provide unique email"],
        unique :[false,"Email Exit"]
    }
  
})


 export default mongoose.model('User',UserSchema)