// import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import ENV from "../config.js";


async function connect (){
    mongoose.set('strictQuery',true)
    // const mongod = await MongoMemoryServer.create();
    // const getUri = mongod.getUri();

    const db = await mongoose.connect(ENV.DATABASE);
    console.log("Database Connected")
    return db;
}

export default connect;