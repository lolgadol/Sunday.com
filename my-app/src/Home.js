import {useNavigate } from "react-router-dom";
import TaskTable from "./taskTable";
import { useUserContext } from "./UserContext";
import JoinGroupModal from "./JoinGroupModal";
import { useEffect, useState } from "react";

import { Menu, X, Plus, Users, UserPlus, ShieldCheck } from 'lucide-react'
import { Button } from "react-bootstrap"

const Home = ()=> {
    const [show,setShow] = useState(false);
    const [showAdminButton,setShowAdminButton] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)


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
        if(user.isKickedOrNewAdmin) {

            if(user.isKickedOrNewAdmin == "kicked") {
                alert("You have been kicked from your group");
                user.isKickedOrNewAdmin = "";
    
    
            }
            else if(user.isKickedOrNewAdmin == "NewAdmin") {
                alert("you have been appointed admin of your group");
                user.isKickedOrNewAdmin = ""; 
            }

            fetch("http://localhost:5000/user/" + user._id, {
                method: "PUT",
                body: JSON.stringify(user),
                headers: {"Content-Type" : "application/json"}
            });
            
        }
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
    


    return (
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Sunday.com</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="mt-6">
              <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={newTaskButton}>
                <Plus className="mr-2 h-5 w-5" />
                Create New Task
              </Button>
              <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={newGroupButton}>
                <Users className="mr-2 h-5 w-5" />
                Create New Group
              </Button>
              <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={() => joinGroupButton()}>
                <UserPlus className="mr-2 h-5 w-5" />
                Join Group
              </Button>
              {showAdminButton && (
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-left" onClick={adminScreenButton}>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Admin Screen
                </Button>
              )}
            </nav>
          </div>
    
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between p-4 bg-white border-b">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800 justify-center ">Welcome, {user.username}</h1>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
              <TaskTable />
            </main>
          </div>
    
          <JoinGroupModal show={show} setShow={setShow} />
        </div>
      )
}

export default Home;