import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'


function Messaging() {
  let {user,authTokens} = useContext(AuthContext)

  return(
    <div>
      <h3>Your Messages</h3> 
      <div>
        <Link to="/inbox" >Inbox</Link>          
        <span> \ </span> 
        <Link to="/sent"> Sent </Link>
      </div>
    </div>
  )


}

export default Messaging