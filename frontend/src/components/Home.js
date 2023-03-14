import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom'
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './HeaderElements';


function HomePage()  {  
    let {user,authTokens} = useContext(AuthContext)

  
  return (
    <div>
        <h5> Welcome to our Website! </h5>
        {user &&
        <Link to="/auctionmanage" > Manage Auctions </Link>          
        } 
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> 
        <Link to="/auctionsearch"> Search Auctions </Link>
    </div>
    
    
  )
}

export default HomePage