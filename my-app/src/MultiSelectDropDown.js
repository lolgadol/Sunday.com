import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { useState } from 'react';

const MultiSelectDropdown = ({ selectedOptions,setSelectedOptions,show, setShow, options }) => {
  


  const handleToggle = (isOpen) => {
    setShow(isOpen);
  };

  const handleOptionClick = (event, option) => {
    event.preventDefault(); // Prevent default action
    event.stopPropagation(); // Stop event propagation
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };
  
  return (
    <Dropdown show={show} onToggle={handleToggle}>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Select Options
      </Dropdown.Toggle>

      <Dropdown.Menu>
      {options.map((option) => (
          <Dropdown.Item
            key={option}
            as="button"
            onClick={(event) => handleOptionClick(event, option)}
          >
            <Form.Check
              type="checkbox"
              label={option}
              checked={selectedOptions.includes(option)}
              onChange={() => {}}
              onClick={(event) => event.stopPropagation()}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiSelectDropdown;