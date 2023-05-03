const bodyParser=require('body-parser')
const express=require('express')
const mongoose=require('mongoose')
const user=require('./modules/user')
const cors=require('cors')
var multer = require('multer');
 
require('dotenv').config();

const PORT=process.env.PORT||4001
 

const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(multer().array())
app.use(cors())


//Mongodb Connection
const url=process.env.ATLAS_URL;
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection=mongoose.connection;

connection.once('open',()=>{
    console.log("Mongodb Connection Successfully!")
})

 

// End Points
app.get('/',(req,res)=>{
    
    res.send("Welcome!")
})
//Signup Page
app.post('/signup',async(req,res)=>{
    const data=req.body;
    console.log("Data is:", req.body)
    const obj={
        Name:data.name,
        Email:data.email,
        Password:data.password
    }
    const dataUser=await user.find({Email:data.email});
    console.log(dataUser.length)
    if(dataUser.length!=0)
    res.json(2);
    else{
    await user.create(obj,(err,item)=>{
        if(err)
        {
            console.log(err);
            res.json(0);
        }
        else{
            item.save();
            res.json(1);
        }
       });
    }

})

//Login Page
app.post('/login',async(req,res)=>{
    const data=req.body;
    const obj={
        Email:data.email,
        Password:data.password
    }
   const user1=await user.find(obj);
   if(user1.length==0)
   res.json(0)
   else
   res.json(1);

})

app.post('/contact',(req,res)=>{
    res.json(1)
})

app.listen(PORT,()=>{
    console.log(`Server runing at localhost:${PORT}`)
})