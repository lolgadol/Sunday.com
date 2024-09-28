
import { useState } from "react";
import UpdateManager from "./UpdateManager"
import UpdateModal from "./UpdateModal";

function ContextMenu({options,xPos,yPos,visible,task,onClick,setShow}) {

  

function clickOption(option) {
  if(option === "update") {
    setShow(true);
  }
  else if(option === "delete") {
    console.log("deleted")
    UpdateManager.delete(task);
    onClick();
    
  }

}
  if(!visible)
    {
      return;
    }
 return(


  <div
  style={{
    position: 'absolute',
    top: `${yPos}px`,
    left: `${xPos}px`,
    backgroundColor: 'white',
    border: '1px solid black',
    zIndex: 1000,
    padding: '10px',
  }} 
  //onClick={() => setContextMenuVisible(false)} // Click outside to close menu
>

  {options.map((option) => (
    <p  onClick = {() => clickOption(option)} style = {{cursor:'pointer'}}>{option}</p>

  ))}
  

</div>
 );
}


export default ContextMenu;