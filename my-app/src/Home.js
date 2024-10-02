import {useNavigate } from "react-router-dom";
import TaskTable from "./taskTable";
import { useUserContext } from "./UserContext";
import JoinGroupModal from "./JoinGroupModal";
import { useState } from "react";

const Home = ()=> {

    const navigate = useNavigate();

    const [show,setShow] = useState(false);

    function newGroupButton() {
        navigate("/CreateGroup")
    }

    const {user} = useUserContext();

    function newTaskButton() {
        navigate("/CreateTask");
    }

    function joinGroupButton() {
        setShow(true);
    }
    return(
        <div>
            <h1>welcome {user.username}</h1>
            <button onClick={()=>newTaskButton()}>Create New Task</button>
            <button onClick={() => newGroupButton()}>Create new group</button>
            <button onClick={()=> joinGroupButton()}>Join Group</button>
            <JoinGroupModal show = {show} setShow = {setShow}/>
            
            <TaskTable />
        </div>
    );
    
}

export default Home;