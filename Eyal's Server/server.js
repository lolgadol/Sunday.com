const express = require ("express");
const cors = require("cors");
const User = require("./User");
const app = express();
const mongoose = require('mongoose');
const {Task} = require("./Task");
const GroupTask = require("./GroupTask");
const Group = require("./Group");
app.use(cors());
app.use(express.json());

const mongo_uri = "mongodb://localhost:27017/eyalDatabase";
mongoose.connect(mongo_uri, {
    
});

app.get("/user/:id",async(req,res)=> {
    try {
        const {id} = req.params;
        const user = await User.findOne({_id:id});
        return res.status(200).send({user});
    }
    catch(e) {
        return res.status(500).send({msg: e.message});
    }
})


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
    const {creator_id,name,priority,status,dueDate} = req.body;
    const newTask = new Task({creator_id,name:name,priority:priority,status:status,dueDate:dueDate});
    await newTask.save();
    res.status(201).json({msg:"task saved succesfully"});
    
})
app.get('/tasks/:userId', async (req, res) => {
    try {
      const {userId} = req.params;
      
      const tasks = await Task.find({creator_id:userId});
      return res.status(200).send(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  app.post("/task/:taskId",async(req,res) => {
    try {
        const {taskId} = req.params;
        const currentTask = await Task.findOne({_id: taskId});
        const {creator_id,name,priority,status,dueDate,workingOnIt} = req.body;
        currentTask.creator_id = creator_id;
        currentTask.name = name;
        currentTask.priority = priority;
        currentTask.status = status;
        currentTask.dueDate = dueDate;

        const userIds = [];

        for(const element of workingOnIt) {
            const user = await User.findOne({username: element});
            userIds.push(user._id);
        }

        currentTask.workingOnIt = userIds;
        
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
        res.status(200).json({msg: "succesfully deleted task"});
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
  });

  app.post("/group",async(req,res) => {
    const {groupName,adminId} = req.body;
    const name = await Group.findOne({name:groupName});
    const admin = await User.findOne({_id:adminId});

    if(admin.group !== "") {
        return res.status(400).send({msg: "You are already the leader of a group"});
    }

    if(name) {
        return res.status(400).send({msg: "group name already exists"});
    }
    const newGroup = new Group({name:groupName, adminId: adminId,memberId:[adminId]});

    await newGroup.save();
    
    admin.group = newGroup._id;

    await admin.save();


    res.status(200).send({newGroup});

  });

  app.get("/group/:id",async(req,res) => {

    try{
        const {id} = req.params;
        const group = await Group.findOne({_id: id});
        if(group){
            const allMembers = group.memberId;
            const users = [];
            for (const member of allMembers) {
                const user = await User.findOne({ _id: member }); // Fetch user by ID
                users.push(user); // Push the user to the users array
            }
            console.log(users);
            res.status(200).send(users);

        }
        else {
            res.status(404).send({msg: "brother"});
        }
    }
    catch(e) {
        res.status(500).send({msg:"bro"})
    }


    

  })
  
  app.post("/joinGroup",async(req,res) => {
    const {userId,groupName} = req.body;
    const group = await Group.findOne({name: groupName});

    const user = await User.findOne({_id: userId});

    if(group) {
        try {
            if(group.memberId.includes(userId)) {
                res.status(400).send({msg: "already part of this group"});
            }
            else {
                group.memberId.push(userId);
                user.group = group._id;
                await user.save();
                await group.save();
                res.status(200).send({msg: "joined group succesfully",group: group._id});
            }
        }
        catch(e) {
            res.status(500).send(e.message);
        }
    }
    else {
        res.status(404).send({msg: "group doesn't exist"});
    }
  })

  app.post("/leaveGroup",async(req,res) => {
    const {userId} = req.body;
    const user = await User.findOne({_id:userId});
    const group = user.group;

    if(group === "")return res.status(400).send({msg:"you have no group"});

    const groupFound = await Group.findOne({_id: group});

    if(groupFound.adminId === userId) {
        const allMembers = groupFound.memberId;
        allMembers.map(async member => {
            const memberName = await User.findOne({_id: member});//deleting the group from everyone when deleted
            if(memberName) {
                memberName.group = "";
                await memberName.save();
            }
        })
        await Group.deleteOne({_id: group});
    }
    else {
        const newMembers = groupFound.memberId.filter((memberId) => memberId !== userId);
        groupFound.memberId = newMembers;
        //TODO: add new Admin
        await groupFound.save();
    }

    user.group = "";
    await user.save();
    res.status(200).send({msg: "you left the group!!!!!!!!!!!!!!!!!!!!!!!!!!"});
  })

  app.post("/groupTask",async(req,res) => {
    const {user_id,group_id,name,priority,status,dueDate} = req.body;//creator_id = task_id
    const newTask = new GroupTask({creator_id:group_id,name,priority,status,dueDate,workingOnIt:[user_id],});//TODO: add functionality to working on it
    await newTask.save();
    res.status(200).send({msg: "task created"});
  });






app.listen(5000);