
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
 username:String,
 password:String
}));

const Orphan = mongoose.model('Orphan', new mongoose.Schema({
 name:String,
 fatherName:String,
 age:Number
}));

const Finance = mongoose.model('Finance', new mongoose.Schema({
 type:String,
 date:String,
 amount:Number,
 desc:String
}));

(async ()=>{
 if(!await User.findOne({username:'admin'})){
   await User.create({username:'admin',password:'1234'});
 }
})();

app.post('/api/login', async (req,res)=>{
 const {username,password} = req.body;
 const user = await User.findOne({username,password});
 res.json({success:!!user});
});

app.get('/api/orphans', async (req,res)=>res.json(await Orphan.find()));
app.post('/api/orphans', async (req,res)=>res.json(await new Orphan(req.body).save()));

app.get('/api/finance', async (req,res)=>res.json(await Finance.find()));
app.post('/api/finance', async (req,res)=>res.json(await new Finance(req.body).save()));

app.get('*',(req,res)=>{
 res.sendFile(path.join(__dirname,'public','index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log("Server running"));
