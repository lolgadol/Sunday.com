import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useUserContext } from "./UserContext";
import { Navigate, useNavigate } from 'react-router-dom';
import customDropDown from './CustomDropDown';
import ContextMenu from './ContextMenu';
import UpdateModal from './UpdateModal';




const TaskTable = ({username}) => {
    


    const [tablePosition,setTablePosition] = useState({x:0, y:0});
    const [isVisible,setIsVisible] = useState(false);
    const [selectedTask,setSelectedTask] = useState({name: "name",status:"status",priority:"priority",dueDate:"dueDate"});
    const [tasksTable,setTasksTable] = useState([]);
    const [show,setShow] = useState(false);

    const [endEdit,setEndEdit] = useState(false);


    
    function updateTable() {
        setTasksTable((prevTasks=>prevTasks.filter(task=>task._id != selectedTask._id)));
    }


    function onRowRightClick(event,task)
    {
        event.preventDefault();
        setTablePosition({x:event.clientX,y: event.clientY});
        setIsVisible(!isVisible);
        setSelectedTask(task);
        

    }

    function onRowClick(event)
    {
        event.stopPropagation();
        if(isVisible){setIsVisible(false);}
    }
    const {id,setId} = useUserContext();
    // const tasks = [
    //     { id: 1, name: 'Task 1', priority: "Low", status: 'Done', DueDate: "23/9/24"},
    //     { id: 2, name: 'Task 2', priority: "Medium", status: 'Working on it',DueDate:"19/10/25" },
    //     { id: 3, name: 'Task 3', priority: "High", status: 'Stuck',DueDate: "09/11/26"},
    // ];
    const navigate = useNavigate();

    


      useEffect(() =>{
        console.log('ended editing');
        fetch('http://localhost:5000/tasks/' + id)
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => setTasksTable(data))      // Store the fetched data in the state
        .catch(error => console.error('Error fetching data:', error));
        
      },[endEdit])




      useEffect(() => {
        document.addEventListener('click', onRowClick);
        return () => {
            document.removeEventListener('click', onRowClick);
          };
        
      },[isVisible]);

    return (
        <div className="container mt-5" onClick={onRowClick}>
            <h2>Task Table</h2>
            <table className="table table-striped table-bordered">
                
                <thead className="thead-light">
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                    </tr>
                </thead>

                <tbody>

                    {tasksTable.map(task => (

                        <tr key={task._id} onContextMenu={(e) => onRowRightClick(e,task)} >

                            <td>{task._id}</td>
                            <td>{task.name}</td>
                            <td>{task.priority}</td>
                            <td>{task.status}</td>
                            <td>{task.dueDate}</td>
                                



                        </tr>
                    ))}
                </tbody>
            </table>

                <ContextMenu setShow={setShow} onClick = {() => updateTable()}options={["update","delete"]} xPos = {tablePosition.x} yPos = {tablePosition.y} visible = {isVisible} task = {selectedTask} ></ContextMenu>
                <UpdateModal setEndEdit = {setEndEdit} show = {show} setShow={setShow} task={selectedTask}/>  
        </div>
    );
};

export default TaskTable;