
import React, { createContext, useContext, useState } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [id, setId] = useState('');
  const [currentUsername,setCurrentUsername] = useState('');

  return (
    <UserContext.Provider value={{ id, setId,currentUsername,setCurrentUsername}}>

    
      {children}
    </UserContext.Provider>
  );
};


export const useUserContext = () => useContext(UserContext);