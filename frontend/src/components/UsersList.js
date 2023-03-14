import React , { useState, useEffect , useContext} from "react";
import axios from "axios";
import {Button} from "reactstrap"; 
import AuthContext from '../context/AuthContext'
import jwtDecode from "jwt-decode";
import { useHistory } from 'react-router-dom'

function UsersList() {
    let {user,authTokens, logoutUser} = useContext(AuthContext)
    const [users, setUsers] = useState(); 
    const history = useHistory() 

    useEffect(() => {
        getUsers() 
    } ,[])

    
    let getUsers = async() =>{
        let response = await fetch('https://127.0.0.1:8000/api/users/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':String(authTokens?.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            setUsers(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }
    
  
    const handleClick = user => e => {
        e.preventDefault();
        try {  
            axios({
                method:"PUT",
                url:`https://127.0.0.1:8000/api/users/${user.id}/`,
                data: {
                    id: user.id,
                    is_active: user.is_active,
                    is_bidder: user.is_bidder,
                    is_guest: user.is_guest,
                    is_seller: user.is_seller,
                    is_staff: user.is_staff,
                    is_superuser: user.is_superuser,
                    last_login: user.last_login,
                    mobile_phone: user.mobile_phone,            
                    name: user.name,
                    password: user.password,
                    scn: user.scn,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    address: user.address,
                    is_accepted: true,
                }
            })
            .then((response) => {
                console.log(response) 
                alert("User has been modified successfully.")

            })
            .catch((error) => {
                console.log(error) 
            })
        } catch (err) {
            console.log("Error Occured")
        }
    
    }
    
    return (
        <div className="container">
            <h3 className="p-3 text-center">List of Users</h3>
            <table className="table table-striped table-bordered">
            <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>SCN</th>
                        <th>Seller</th>
                        <th>Bidder</th>
                        <th>Staff</th>
                        <th>Pending Status</th>
                    </tr>
                </thead>
            <tbody>
            {users && users.map(user =>
               <tr key={user.id}> 
                <td> {user.id} </td>
                <td> {user.username} </td> 
                <td> {user.name} </td> 
                <td> {user.surname} </td> 
                <td> {user.mobile_phone} </td> 
                <td> {user.email} </td> 
                <td> {user.address} </td> 
                <td> {user.scn} </td> 
                <td> {user.is_seller ? "Yes" : "-"} </td>  
                <td> {user.is_bidder ? "Yes" : "-"} </td>  
                <td> {user.is_staff ? "Yes" : "-"} </td>  
                <td> {user.is_accepted ? "-" : "Not Accepted" &&
                 <Button onClick={handleClick(user)} color="primary" >Accept User</Button>} </td>
                </tr> 
            )} 
            </tbody>
        </table> 
        </div>
    )
}

export default UsersList