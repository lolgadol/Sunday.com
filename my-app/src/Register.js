import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
 function Register () {
    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');
    const navigate = useNavigate();
    async function registerButton(){ 
        fetch("http://localhost:5000/register",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
              },
              
            body:JSON.stringify({
                username:username, password:password
            }),
            
        }).then(async response=>{
            if(response.ok) {
                navigate("/Login")
            }
            else {
                alert(await response.json());
            }
        });
    }

    function loginButton() {
        navigate('/Login');
    }
    return(
        <div className='centerDiv'>
            <input placeholder='Username' onChange={(e) => setUsername(e.target.value)}>
            </input>
            <input placeholder='Email' >
            </input>
            <input placeholder='Password 'onChange={(e) => setPassword(e.target.value)}>
            </input>
            <input placeholder='Confirm Password '>
            </input>

            <button className='button' onClick={()=> registerButton()}>Register</button>
            <button onClick={()=> loginButton()}>Already have an account? Log in</button>
        </div>
    );
}

export default Register;



