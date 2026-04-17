
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB OK"))
.catch(err=>console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
 username:String,
 password:String
}));

(async ()=>{
 if(!await User.findOne({username:'admin'})){
  await User.create({username:'admin',password:'1234'});
 }
})();

app.post('/api/login', async (req,res)=>{
 const {username,password}=req.body;
 const user=await User.findOne({username,password});
 res.json({success:!!user});
});

app.get('*',(req,res)=>res.sendFile(process.cwd()+"/public/index.html"));

app.listen(process.env.PORT||10000);
