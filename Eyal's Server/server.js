const express = require ("express");
const cors = require("cors");
const User = require("./User");
const app = express();
const mongoose = require('mongoose');
const Task = require("./Task");
app.use(cors());
app.use(express.json());

const mongo_uri = "mongodb://localhost:27017/eyalDatabase";
mongoose.connect(mongo_uri, {
    
});


app.post("/login",async(req,res) =>{
    const {username,password} = req.body;
    const user = await User.findOne({username:username});
    if(user) {
        if(user.password == password) {
            return res.status(200).json({user});
        }
        else {
            return res.status(404).json({msg:"user not found"});
        }
    }
    else{
        return res.status(404).json({msg:"user not found"});
    }
})

app.post("/register",async(req,res) =>{
    const {username,password} = req.body;
    const user = await User.findOne({username:username});
    if(user) {
        return res.status(400).json({msg:"user already exists"});
    }
    const newUser = new User({username: username,password: password});
    await newUser.save();
    res.status(201).json({msg:"user registered succesfully"});
})


app.post("/task",async(req,res) => {
    const {user_id,name,priority,status,dueDate} = req.body;
    const newTask = new Task({user_id,name:name,priority:priority,status:status,dueDate:dueDate});
    await newTask.save();
    res.status(201).json({msg:"task saved succesfully"});
    
})
app.get('/tasks/:userId', async (req, res) => {
    try {
      const {userId} = req.params;
      
      const tasks = await Task.find({user_id:userId});
      console.log(tasks);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  app.post("/task/:taskId",async(req,res) => {
    try {
        const {taskId} = req.params;
        const data = req.body;
        const currentTask = await Task.findOne({_id: taskId});
        const {user_id,name,priority,status,dueDate} = req.body;
        currentTask.user_id = user_id;
        currentTask.name = name;
        currentTask.priority = priority;
        currentTask.status = status;
        currentTask.dueDate = dueDate;
        console.log(req.body);
        if(currentTask!= null){await currentTask.save();}
        res.status(200).send(currentTask);
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }

    
  });
  app.delete("/task/:taskId",async(req,res) => {
    const {taskId} = req.params;
    try
    {
        await Task.deleteOne({_id: taskId});
        res.status(200).json({msg: "succesfully deleted user"});
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
    
    
    
  })

app.listen(5000);