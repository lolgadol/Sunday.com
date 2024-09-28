import {useNavigate } from "react-router-dom";
import TaskTable from "./taskTable";
import { useUserContext } from "./UserContext";

const Home = ()=> {

    const navigate = useNavigate();



    function newGroupButton() {
        navigate("/CreateGroup")
    }

    const {currentUsername} = useUserContext();

    function newTaskButton() {
        navigate("/CreateTask");
    }
    return(
        <div>
            <h1>welcome {currentUsername}</h1>
            <button onClick={()=>newTaskButton()}>Create New Task</button>
            <button onClick={() => newGroupButton()}>Create new group</button>
            <TaskTable username = {currentUsername} />
        </div>
    );
    
}

export default Home;