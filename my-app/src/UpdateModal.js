import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useUserContext } from './UserContext';
import MultiSelectDropdown from './MultiSelectDropDown';

function UpdateModal({ show, setShow, task, setEndEdit }) {

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [options,setOptions] = useState([]);


  const { user } = useUserContext();
  

  // State to hold the form data
  const [formData, setFormData] = useState({
    name: task.name,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate
  });

  async function getGroupMembers() {
    const response = await fetch("http://localhost:5000/group/" + task.creator_id,{
      method: "GET",
      headers: {"Content-Type" : "application/json"}
    })
    if(response.ok) {
      const responseJson = await response.json();
      setOptions(responseJson.map(user=> {
        return user.username;
      }))
    }
  }
  // Manually reset form data each time the modal opens
  useEffect(() => {
    if (show) {
      // Reset form data when modal opens
      setFormData({
        name: task.name,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
      });
      getGroupMembers();     
    }
  }, [show, task]); // Only runs when `show` or `task` changes

  const handleClose = () => setShow(false);

  // Generalized input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Function to handle the form submission and task update
  async function updateButton() {
    console.log(selectedOptions);

   

    try {
      const response = await fetch(`http://localhost:5000/task/${task._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creator_id: task.kind ? user.group : user._id,
          workingOnIt: selectedOptions,
          ...formData, // Spread form data into request body
        })
      });

      if (response.ok) {
        setEndEdit((prevEdit) => !prevEdit); // Toggle the edit state
      }
    } catch (err) {
      console.error('Error updating task:', err.message);
    }

    handleClose();
  }



  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPriority">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </Form.Group>

          <MultiSelectDropdown setShow={()=>{}} options={options} setSelectedOptions={setSelectedOptions} selectedOptions={selectedOptions}></MultiSelectDropdown>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateButton}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateModal;