import { Button } from "bootstrap";
import "./CreateTask.css"
import { useUserContext } from "./UserContext";
import { useState } from "react";
import CustomDropDown from "./CustomDropDown";

import { useNavigate } from "react-router-dom";


function CreateTask() {


    //const titlepriority = "priority"

    const {user,setUser} = useUserContext();
    const [name,setName] = useState('');
    const [priority,setPriority] = useState('priority');
    const [status,setStatus] = useState('status');
    const [dueDate,setDueDate] = useState('');
    const [taskPersonal,setTaskPersonal] = useState('personal');

    const {currentUsername} = useUserContext();
    
    const navigate = useNavigate();
    console.log(user._id);
    function createTaskButton() {
        if(taskPersonal === "personal") {

            console.log(status + " " + priority);
            fetch("http://localhost:5000/task",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
                user_id:user._id,name,priority,status,dueDate
                })
    
            }).then(response=>{
                if(response.ok) {
                    alert("NIGGER NIGGER NIGGER");
                    navigate("/home");
                }
                else
                {
                    alert("NIGGG");
                }
            });
        }
        else if(taskPersonal === "group") {
            if(user.group === "") {
                alert("you have no group my nigga");
            }
            else {

                fetch("http://localhost:5000/groupTask", {
                    method:"POST",
                    headers:{"Content-Type" : "application/json"},
                    body: JSON.stringify({user_id: user.group,name,priority,status,dueDate})
                    
                }).then(response=>{
                    if(response.ok) {
                        alert("task created successfully");
                        navigate("/home");
                    }
                    else {
                        alert("task not created successfully")
                    }
                })
            }
        }

    }
    return(
        <div >
            <h1 className="underline">
                CREATE TASK
            </h1>
            <input className="input" placeholder="name"onChange= {(e) => setName(e.target.value)}></input>
            <input className="input" placeholder="due date"onChange= {(e) => setDueDate(e.target.value)}></input>
            <CustomDropDown className = "dropDown" items = {["low","medium","high"]} title = {priority} setState={setPriority} /> 
            <CustomDropDown className = "dropDown" items= {['done','working on it','stuck','other']}title = {status} setState={setStatus}/>
            <CustomDropDown className = "dropDown" items = {["personal","group"]} title = {taskPersonal} setState={setTaskPersonal} />
            <button className="input" onClick={()=>createTaskButton()}>Add task</button>
            
        </div>
    );
}



export default CreateTask;