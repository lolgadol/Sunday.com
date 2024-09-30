
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useUserContext } from './UserContext';
import { useState } from 'react';


function JoinGroupModal({show,setShow,setEndEdit}) {


  const [groupName,setGroupName] = useState('');

  const {user,setUser} = useUserContext();
  
  const handleClose = () => setShow(false);

  async function joinGroupButton() {

    if(!user.group) {
      const response = await fetch("http://localhost:5000/joinGroup",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({userId:user._id,groupName})
      })
  
      if(response.ok) {
        alert("group joined succesfully");
        const responseJson = await response.json();
        setUser((user )=> ({
          ...user, group:responseJson.group
        }))
        handleClose();
      }
      else { 
        const error = await response.json();
        alert(error.msg);
      }

    }
    else {
      alert("already in group");
      handleClose();
    }

  }

  //TODO: update task table when joining a group
    return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label> Group Name</Form.Label>
                <Form.Control
                  name="name"
                  onChange={(e) => setGroupName(e.target.value)}              
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleClose()} variant="secondary">
              Close
            </Button>
            <Button onClick={() => joinGroupButton()} variant="primary">
              Join Group
            </Button>
          </Modal.Footer>
        </Modal>
      );
}



export default JoinGroupModal;