import { useState } from "react";
import "./CreateGroup.css"
import {Button} from "react-bootstrap"
import { useUserContext } from './UserContext';
import { useNavigate } from "react-router-dom";


const CreateGroup = () => {

    const [name,setName] = useState();
    const {id} = useUserContext();
    const navigate = useNavigate();

    async function createGroupButton() {
        const response = await fetch("http://localhost:5000/group",{
            headers: {"Content-Type" : "application/json"},
            method: "POST",
            body:JSON.stringify({groupName: name,adminId:id})
        });
        if(response.ok) {
            alert("niggerrrrr");
            navigate("/home");
        }
        else{
            const responseJson = await response.json();
            alert(responseJson.msg);
        }
    }

    async function leaveGroupButton() {
        const response = await fetch("http://localhost:5000/leaveGroup", {
            headers: {"Content-Type" : "application/json"},
            method: "POST",
            body: JSON.stringify({userId: id})
        })

        if(response.ok) {
            const responseJson = await response.json()
            alert(responseJson.msg);
            navigate("/home");
        }
        else {
            const responseJson = await response.json()
            alert(responseJson.msg);
        }
    }
    return(
        <div>
            <h1 className = "underline">CREATE GROUP</h1>
            <input className= "input" placeholder = "Group Name" onChange={(e) => setName(e.target.value)}></input>
            <Button onClick={()=> createGroupButton()} className="buttonCreateGroup">Create Group</Button>
            <Button className="buttonCreateGroup" onClick={()=> leaveGroupButton()}>Leave Group</Button>
        </div>
    );
}



export default CreateGroup;