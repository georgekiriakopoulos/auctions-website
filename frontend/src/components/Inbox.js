import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    Form,
    FormGroup,
    Input,
    Label,
  } from "reactstrap";


function Inbox()  {  
    let {user,authTokens} = useContext(AuthContext)
    let [messages,setMessages] = useState()
    const [show, setShow] = useState(false);



    if (authTokens) {
        var accessToken = authTokens.access
        var decToken = jwtDecode(accessToken)
        var userId = decToken.user_id 
      }else {
        var accessToken = user
        var userId = user.user_id
      }

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
    
      const showModal = () => {
        setShow(true);
      }

      useEffect(() => {
        getMessages()
        createMessage() 
      } ,[])

      let getMessages = async() => {
        let response = await fetch(`https://127.0.0.1:8000/api/messages`, {
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':String(accessToken)
        },
        })
        let data = await response.json()
        if (response.status === 200) { 
          setMessages(data) 
        }
        else {
          alert("Error at fetching messages from the api.");  
        }
      }

      const createMessage = async (e) => {
        e.preventDefault() 
        let response = await fetch("https://127.0.0.1:8000/api/messages/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization':String(accessToken)
          },
          body: JSON.stringify({
            'sender':e.target.sender.value, 
            'receiver':e.target.receiver.value, 
            'textMessage':e.target.textMessage.value, 
            'closedAuction':e.target.closedAuction.value, 
          })
        });
        if (response.status === 200) {
          alert("Your Message has been sent succesfully!")
        } else {
          alert("Something went wrong!");
        }
      }; 


  return (
    <div>
       <h3>Inbox</h3>
       <div className='item-container'>
            {messages &&  messages.filter(message => message.receiver===userId).map((message) => (
                <div className='card' key={message.id}>
                <h4>{message.closedAuction}</h4>
                <h6>Sent by:{message.sender}</h6>
                <p>{message.textMessage}</p>
                <> 
      <Button variant="primary" onClick={handleShow}>
        Reply
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={createMessage}>
            <FormGroup>
                <Label for="closedAuction">For Auction:</Label>
                <Input
                type="text"
                name="closedAuction"
                placeholder=""
                defaultValue = {message.closedAuction} 
              />
            </FormGroup>
            <FormGroup>
                <Label for="sender">By:</Label>
                <Input
                type="text"
                name="sender"
                placeholder=""
                defaultValue = {message.receiver} 
              />
            </FormGroup>
            <FormGroup>
                <Label for="receiver">To:</Label>
                <Input
                type="text"
                name="receiver"
                placeholder=""
                defaultValue = {message.sender} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="textMessage">Message:</Label>
              <Input
                type="text"
                name="textMessage"
                placeholder="Please type in your Message."
              />
            </FormGroup>
            <input type="submit" />
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
          </div>
        ))}
      </div>
 
    </div>
    
    
  )
}

export default Inbox