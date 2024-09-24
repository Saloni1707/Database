const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "asad@ssd";

const { UserModel , TodoModel } = require("./db");
const { default: mongoose } = require("mongoose");
mongoose.connect("mongodb+srv://SaloniAtole:Qs72aKQ7eaZHkiuF@cluster0.po79z.mongodb.net/");

app.use(express.json()); //since we're parsing the json body possible only using the express.json()

app.post("/signup",async (req,res)=>{
    const email = req.body.email ;
    const name = req.body.name ; 
    const password = req.body.password ; 

    await UserModel.create({
        email:email , 
        name:name , 
        password:password ,
    })

    res.json({
        message:"You are logged in "
    })

});

app.post("/signin",async function (req,res) {
    const email = req.body.email ; 
    const password = req.body.password ; 

    const user = await UserModel.findOne({
        email : email , 
        password : password 
    })
    //chk if the user is present 
    if(user){
        const token  = jwt.sign({
            id : user._id.toString()
        },JWT_SECRET);

        res.json({
            token:token
        });
    }else{
        res.status(404).json({
            message:"Incorrect credentials"
        })
    }
    
})


app.post("/todo",auth,async (req,res)=>{
    const userId = req.userId ;
    const title = req.body.title;
    const done = req.body.done ;
    await TodoModel.create({
        title,
        userId,
        done
    })
    res.json({
        message:"Todo created"
    })
})

app.get("/todos",auth,async(req,res)=>{
    const userId = req.userId ; 
    const todos = await TodoModel.find({    //todos return krdia
        userId : userId 
    })
    res.json({
        todos
    })   
})

function auth(req,res,next){
    const token = req.headers.token ;
    const decodedData = jwt.verify(token , JWT_SECRET);

    if(decodedData){
        req.userId = decodedData.Id ; 
        next();
    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }

}

app.listen(3000);
