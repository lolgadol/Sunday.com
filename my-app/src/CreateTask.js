import { Button } from "bootstrap";
import "./CreateTask.css"
import { useUserContext } from "./UserContext";
import { useState } from "react";
import CustomDropDown from "./CustomDropDown";

import { useNavigate } from "react-router-dom";


function CreateTask() {


    //const titlepriority = "priority"

    const {id,setId} = useUserContext();
    const [name,setName] = useState('');
    const [priority,setPriority] = useState('priority');
    const [status,setStatus] = useState('status');
    const [dueDate,setDueDate] = useState('');

    const {currentUsername} = useUserContext();
    
    const navigate = useNavigate();
    console.log(id);
    function createTaskButton() {
        console.log(status + " " + priority);
        fetch("http://localhost:5000/task",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
            user_id:id,name,priority,status,dueDate
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
        })

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
            <button className="input" onClick={()=>createTaskButton()}>Add task</button>
            
        </div>
    );
}



export default CreateTask;