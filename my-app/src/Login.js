import { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

function Login() {
    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');

    const {setUser} = useUserContext();
    
    const navigate = useNavigate();
    async function buttonLogin() {
        fetch("http://localhost:5000/login",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
              },
              
            body:JSON.stringify({
                username:username, password:password
            })
        }).then(async response=>{
            if(response.ok) {
                const nig = await response.json();
                setUser(nig.user);
                navigate("/home");
                

            }
            else {
                alert("incorrect username or password")
            }
        })
    }

    function registerButton() {
        navigate("/Register");
    }
    return(
        <div className='centerDiv'>
            <input placeholder='Username' onChange={(e) => setUsername(e.target.value)}>
            </input>
            <input placeholder='Password 'onChange={(e) => setPassword(e.target.value)}>
            </input>

            <button className='button' onClick={()=> buttonLogin()}>Login</button>
            <button onClick={()=>registerButton()}>Have no Account? Register</button>
        </div>
    );
}

export default Login;

