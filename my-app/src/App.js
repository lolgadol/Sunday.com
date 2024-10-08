import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import CreateTask from './CreateTask';
import { UserProvider } from './UserContext';
import CreateGroup from './CreateGroup';
import AdminPanel from './AdminPanel';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/CreateTask" element={<CreateTask/>} />
          <Route path="/CreateGroup" element={<CreateGroup/>} />
          <Route path= "/AdminPanel" element= {<AdminPanel/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;