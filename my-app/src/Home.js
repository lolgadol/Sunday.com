import {useNavigate } from "react-router-dom";
import TaskTable from "./taskTable";
import { useUserContext } from "./UserContext";
import JoinGroupModal from "./JoinGroupModal";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Home = ()=> {
    const [show,setShow] = useState(false);
    const [showAdminButton,setShowAdminButton] = useState(false);
    const {user} = useUserContext();
    const navigate = useNavigate();

    async function isAdmin() {
        const response = await fetch("http://localhost:5000/getGroup/" + user.group,{
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        }) 
        if(response.ok) {
            const group = await response.json();
            if(group.adminId === user._id) {
                console.log("nigger");
                setShowAdminButton(true);
                
            }
            else {
                setShowAdminButton(false);
            }

        }
    }

    useEffect(()=> {
        isAdmin();
    },[user])

    

    function newGroupButton() {
        navigate("/CreateGroup")
    }

    

    function newTaskButton() {
        navigate("/CreateTask");
    }

    function adminScreenButton() {
        navigate("/AdminPanel");
    }

    function joinGroupButton() {
        setShow(true);
    }
    


    return(
        //TODO: figure out button visibility
        <div>
            <h1>welcome {user.username}</h1>
            <Button onClick={()=>newTaskButton()}>Create New Task</Button>
            <Button onClick={() => newGroupButton()}>Create new group</Button>
            <Button onClick={()=> joinGroupButton()}>Join Group</Button>
            {showAdminButton && (
                <Button onClick={()=> adminScreenButton()}>admin screen</Button>
            )}
            <JoinGroupModal show = {show} setShow = {setShow}/>
            
            <TaskTable />
        </div>
    );
    
}

export default Home;