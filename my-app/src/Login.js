import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState('login');
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log(`${formState} attempted`, { username, password });
    if(formState == "login") {
        
        await buttonLogin();
    }

    else {
        await registerButton();
        setFormState("login");
    }
  };

  const toggleForm = () => {
    setFormState(prevState => prevState === 'login' ? 'register' : 'login');
    setUsername('');
    setPassword('');
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

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

    // function registerButton() {
    //     navigate("/Register");
    // }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={formState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                  {formState === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-2">
                      Username
                    </label>
                    <motion.div
                      animate={{ scale: focusedField === 'username' ? 1.02 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <input
                        type="text"
                        id="username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => handleFocus('username')}
                        onBlur={handleBlur}
                        required
                      />
                    </motion.div>
                  </div>
                  <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                      Password
                    </label>
                    <motion.div
                      animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative"
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => handleFocus('password')}
                        onBlur={handleBlur}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </motion.div>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.svg
                        className="animate-spin h-5 w-5 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </motion.svg>
                    ) : (
                      formState === 'login' ? 'Login' : 'Register'
                    )}
                  </motion.button>
                </form>
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={toggleForm}
                    className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                  >
                    {formState === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      );
}

export default Login;

