import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function CustomDropDown({items,title,setState,className}) {

  const [buttonText,setButtonText] = useState(title);
  console.log(items);
  return (
    <Dropdown className = {className}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {buttonText}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {items.map(item=>
            <Dropdown.Item onClick={() =>{
              setState(item);
              setButtonText(item);
            }}>{item}</Dropdown.Item>       
                            
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default CustomDropDown;