import React, {useContext, useState , useEffect } from 'react'
import {Form, FormGroup } from "reactstrap";
import AuthContext from '../context/AuthContext'
import {Button, Alert} from 'reactstrap' 


const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => {
return (<input type={type} name={name} checked={checked} onChange={onChange} /> )
}

const RegisterPage = () => {
    const [checkedItems, setCheckedItems] = useState({}); 
    const [checkedOne, setCheckedOne] = React.useState(false);
    const [checkedTwo, setCheckedTwo] = React.useState(false);

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
  };

  const handleChangeTwo = () => {
    setCheckedTwo(!checkedTwo);
  };
  
 
  let {registerUser} = useContext(AuthContext)

  
  return (
    <div>
        <Form onSubmit={registerUser}>
          <FormGroup>
            <input type="text" name="username" placeholder="Enter Username" />
          </FormGroup>
          <FormGroup> 
            <input type="password" name="password" placeholder="Enter Password" />
          </FormGroup>
          <FormGroup>
            <input type="password2" name="password2" placeholder="Confirm Password" /> 
          </FormGroup>
          <FormGroup>
            <input type="text" name="name" placeholder="Enter First Name"/>
          </FormGroup>
          <FormGroup>
            <input type= "text" name="surname" placeholder="Enter Surname" />
          </FormGroup>
          <FormGroup>
            <input type= "number" name="mobile_phone" placeholder="Enter mobile phone" />
          </FormGroup>
          <FormGroup>
            <input type= "email" name="email" placeholder="Enter email" />
          </FormGroup>
          <FormGroup>
            <input type= "text" name="address" placeholder="Enter Address" />
          </FormGroup>
          <FormGroup> 
            <input type= "number" name="scn" placeholder="Enter Social Security Number" />
          </FormGroup>
          <label>Are you a Seller, a Bidder, or both? </label> <br/>
          <FormGroup> 
          <label> 
        <input type="checkbox"
          label="Seller"
          name="is_seller"
          value={checkedOne}
          onChange={handleChangeOne}
        /> Seller
        </label>
        </FormGroup>
        <FormGroup>
        <input type="checkbox"
          label="Bidder"
          name="is_bidder"
          value={checkedTwo}
          onChange={handleChangeTwo}
        />Bidder
         </FormGroup>
        <input type="submit"/>
        </Form>
    </div>
  )
}

export default RegisterPage