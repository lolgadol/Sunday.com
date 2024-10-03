import { useEffect } from "react";
import { useUserContext } from "./UserContext";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function AdminPanel() {
    const [group,setGroup] = useState({});
    const [groupMembers,setGroupMembers] = useState([]);
    const [groupTasks,setGroupTasks] = useState([]);
    const {user} = useUserContext();

    const navigate = useNavigate();


    function getTasks() {
        fetch('http://localhost:5000/tasks/' + user.group)
        .then(response => response.json()) 
        .then(data => { 
            data.map(task=> {
                task.workingOnIt.map( async (worker,index) =>{ 
                    const response = await fetch("http://localhost:5000/user/" + worker,{
                        method: "GET",
                        headers:{"Content-Type" : "application/json"}
                    })
                    if(response.ok) {
                        const responseJson = await response.json();
                        task.workingOnIt[index] = responseJson.user.username;
                        setGroupTasks([...data]);
                        
                    }
                })

            })
            
            
        }) //fetches group tasks   
        .catch(error => console.error('Error fetching data:', error));        
    }
    async function getGroup() {
        const response = await fetch("http://localhost:5000/getGroup/" +user.group,{
            method:"GET",
            headers:{"Content-Type" : "application/json"}
        })

        if(response.ok) {
            const responseJson = await response.json();
            setGroup(responseJson);
            await getMembers();
            getTasks();
        }
    }

    async function getMembers() {
        const response = await fetch("http://localhost:5000/group/" + user.group, {
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        }) 

        if(response.ok) {
            const responseJson = await response.json();
            setGroupMembers(responseJson);
            console.log(groupMembers);
        }
    }

    useEffect(() => {
        getGroup();
    }     
    ,[user])

    async function kickButton(user) {
        const response = await fetch("http://localhost:5000/leaveGroup",{
            method: "POST",
            body: JSON.stringify({userId: user._id}),
            headers:{"Content-Type" : "application/json"}
        })

        if(response.ok) {
            alert("user " + user.username + " has been kicked");
            setGroupMembers(groupMembers.filter(member=>member._id !== user._id)); //TODO: send an alert to the user that was kicked
        }
        else {
            alert("bro");
        }
    }

    async function promoteButton(member) {
        const response = await fetch("http://localhost:5000/promote", {
            method: "POST",
            body: JSON.stringify({newAdmin: member}),
            headers:{"Content-Type" : "application/json"}
        })

        if(response.ok) {
            alert("nigger");
            navigate("/home");
        }
        else{
            alert("bro");
        }
    }


    return(
        <div className="container mt-5">
            <h1>Admin Panel</h1>
            <h2>Manage {group.name}</h2>
            <table className="table table-striped table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>Member</th>
                        <th>Working on</th>
                        <th>Manage member</th>
                    </tr>
                </thead>

                <tbody>
                    {groupMembers.map(member=> (
                        <tr key= {member._id}>
                            <td>{member.username}</td>
                            <td>{groupTasks.filter(task=>(
                                task.workingOnIt.includes(member.username)
                            )).map(task=>task.name).join(",")}</td>
                            <td>
                                <Button variant = "success" onClick={()=>promoteButton(member)}>Promote to Admin</Button>
                                <Button variant = "danger" onClick={()=>kickButton(member)}>Kick from group</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



export default AdminPanel;