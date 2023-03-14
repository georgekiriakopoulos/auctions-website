import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';



function Sent()  {  
    let {user,authTokens} = useContext(AuthContext)
    let [messages,setMessages] = useState()


    if (authTokens) {
        var accessToken = authTokens.access
        var decToken = jwtDecode(accessToken)
        var userId = decToken.user_id 
      }else {
        var accessToken = user
        var userId = user.user_id
      }

      useEffect(() => {
        getMessages();
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

      const deleteMessage = async (messageId) => {
        let response = await fetch(`https://127.0.0.1:8000/api/messages/${messageId}/`, {
          method: "DELETE", 
          headers: {
            "Content-Type": "application/json",
            'Authorization':String(accessToken)
          }
        });
        if (response.status === 200) {
          alert("Successfully deleted the Message!")
        } else {
        }
      }
  return (
    <div>
        <h3>Sent</h3>
        <div className='item-container'>
            {messages &&  messages.filter(message => message.sender===userId).map((message) => (
                <div className='card' key={message.id}>
                <h4>{message.closedAuction}</h4>
                <h5>Sent to winner with user id:{message.receiver}</h5>
                <p>{message.textMessage}</p>
                <Button variant="danger" onClick={() => deleteMessage(message.id)}>Delete Message</Button>
          </div>
        ))}
      </div>
    </div>
    
    
  )
}

export default Sent