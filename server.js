 import express from 'express';
 import cors from 'cors';
 import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import path from 'path';



 const app = express();

 app.use(express.json());
 app.use(cors());
 app.use(morgan('tiny'));
 app.disable('x-powered-by')

 const port = 5500;

 const __dirname =path.resolve();
 app.use(express.static(path.join(__dirname,'./frontend/build/index.html')))

//  app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'./frontend/build/index.html'))
//  })

// //  http GET request
// app.get('/',(req,res)=>{
//     res.status(201).json("Home GET Request")
// }) 

app.use('/api',router)

connect().then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Server not Connected")
    }
}
    
).catch((error)=>{
console.log("Cannot connect to Database")
})

