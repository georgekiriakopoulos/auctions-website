import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {Button} from "reactstrap"; 
import jwtDecode from 'jwt-decode';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './HeaderElements';


function Header(){
  let {user, logoutUser, authTokens} = useContext(AuthContext) 
  return (
    <div>
      <Nav>
        <Bars /> 
        <NavMenu> 
          <NavLink to="/home" activeStyle >Home</NavLink>
          
        </NavMenu>
          {user && (<span> </span>)}
          {((user && user.is_staff ) || ( authTokens && jwtDecode(authTokens.access).is_staff)) &&
          <NavMenu> 
            <NavLink to ="/userslist"> Users List</NavLink>  
          </NavMenu>
          }
          {user && (<span> </span>)}
          {user &&   
          ( 
          <NavLink to="/messaging"> Messaging </NavLink>
          )
        }
        <NavLink to='/register'>Register</NavLink>
        {user ? ( 
            <NavBtn>
              <Button onClick={logoutUser}>Logout</Button>
            </NavBtn>
          ): (
            <NavLink to="/login" >Login</NavLink>
          )}
        
      </Nav>
    </div>
  )
}

export default Header 