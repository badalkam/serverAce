import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    propertyname :{ type: String,},
    address :{ type: String,},
    about :{ type: String,},
    bhk1 :{ type: Boolean,},
    bhk2 :{ type: Boolean,},
    bhk3 :{ type: Boolean,},
    sell :{ type: Boolean,},
    rent :{ type: Boolean,}, 
    photo :{ type: String,}, 
    username :{ type: String,}, 
    price :{ type: Number,}, 
})


 export default mongoose.model('Property',PropertySchema)