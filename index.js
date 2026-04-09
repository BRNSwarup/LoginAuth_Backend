import express from "express"
import cros from 'cors';
import bcrypt from 'bcrypt'
import pool from "./db.js";
import { generateOTP, currentOTP, sendEMail,generateJWT,JWTAccessTokenverification } from "./utils.js";

const app = express()
app.use(cros({
    origin: '*'
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({ message: "hey,Hiiii" })
})

app.post("/forgotPassword",async (req,res)=>{
    // console.log(req.body)
   const{email}= req.body
//    console.log(email)
   const user = await pool.query(`SELECT * FROM users WHERE mail ="${email}"`);
    if(user[0].length==0){
        res.status(404).json({message:"User Not Exists"})
    }
    else{
        const generatedOTP=generateOTP();
        currentOTP[email]=generatedOTP;
        sendEMail(email,generatedOTP)
        .then((data)=>{
            console.log("line 31",data)
            res.status(200).json({message: "OTP Sent Successfully"});
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({message:"OTP not sent successfully"})
        })
    }
})

app.post('/verifyOTP', async(req,res)=>{
        const{email,otp}=req.body
        // console.log(email,otp, currentOTP[email])
        // console.log("line 44",Object.keys(currentOTP).includes(email));
        if(Object.keys(currentOTP).includes(email)){
            if (currentOTP[email]==otp) {
                res.status(200).json({message:"verified successfully"})
            } else {
                res.status(401).json({message:"OTP not verified"})
            }
        }
        else{
            res.status(401).json({message:"OTP does not exists for this mail"})
        }
})

app.post('/newpassword',async(req,res)=>{
    const email=req.body.email;
    const password = req.body.password;
    const UpdatedHashPassword = await bcrypt.hash(password,10)
    const UpdatedData = await pool.query(`update users set hpassword='${UpdatedHashPassword}' where mail='${email}'`)
    res.status(200).json(UpdatedData)
    // console.log("Line:65",UpdatedData)


})


app.post('/newUser', async (req, res) => {
    // console.log(req.body)
    const name = req.body.name
    const mail = req.body.email
    const password = req.body.password
    const hpassword = await bcrypt.hash(password, 10)
    // console.log("haspassword",hpassword)
    const newuser = await pool.query(`insert into users (name,mail,hpassword) values('${name}','${mail}','${hpassword}')`)
    // console.log(newuser)
    res.status(200).json({ message: "New User Add" })
})

app.post('/login', async (req, res) => {
    // console.log(req.body)
    // console.log(req.headers['authorization'])
    const mail = req.body.email
    const password = req.body.password
    const [rows] = await pool.query("SELECT * FROM users WHERE mail = ?", [mail]);

    if (rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
    }

    if (rows.length > 1) {
        return res.status(401).json({ message: "mail already exist" });
    }

    const user = rows[0]
    // console.log(user);
    //  output   {
    //   Id: 2,
    //   name: 'bswarup',
    //   mail: 'bswarup2222@gmail.com',
    //   hpassword: '$2b$10$xPOBx5SuwHFqonrOhTS2qelipqsC8AcdOhpZz7OhNZ53QlabJ5WNy',
    //   CreatedAt: 2026-02-15T05:51:18.000Z
    // }
    const ispassword = await bcrypt.compare(password, user.hpassword);
    // console.log(ispassword)
    if(ispassword){
        const accessToken=generateJWT({mail:user.mail,name:user.name})
        res.status(200).json({userAuth:true,accessToken})
    }else{
        res.status(401).json({userAuth:false})
    }
})

app.get('/usersData',JWTAccessTokenverification,(req,res)=>{
    res.status(200).json({message:"users data"})
})

app.listen(3000, () => {
    console.log("Server is running")
})