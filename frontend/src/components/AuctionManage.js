import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import jwtDecode from 'jwt-decode';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    Form,
    FormGroup,
    Input,
    Label,
  } from "reactstrap";
import { Link } from 'react-router-dom';

function AuctionManage() {
let {user,authTokens} = useContext(AuthContext)
if (authTokens) {
  var accessToken = authTokens.access
  var decToken = jwtDecode(accessToken)
  var userId = decToken.user_id 
  var isSeller = decToken.is_seller
  var isBidder = decToken.is_bidder
}else {
  var accessToken = user
  var userId = user.user_id
  var isSeller = user.is_seller
  var isBidder = user.is_bidder
}

  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState(); 
  const [categories2, setCategories2] = useState(); 
  const [categories3, setCategories3] = useState(); 
  const [auctions,setAuctions] = useState(); 
  const [mytext, setMyText] = useState('');


  useEffect(() => {
    fetchCategories();
    getAuctions(); 
} ,[])


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showModal = () => {
    setShow(true);
}


const handleTextChange = event => {
  setMyText(event.target.value);
};


  const createAuction = async (e) => {
    e.preventDefault() 
    let response = await fetch("https://127.0.0.1:8000/api/auctions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization':String(accessToken)
      },
      body: JSON.stringify({
        'name':e.target.name.value, 
        'categories':finalcategory,  
        'buy_price':e.target.buy_price.value,
        'first_bid' :e.target.first_bid.value,
        'location' :e.target.location.value,
        'country' :e.target.country.value,
        'latitude' :e.target.latitude.value,
        'longitude' :e.target.longitude.value,
        'started' :e.target.started.value,
        'ends' :e.target.ends.value,
        'seller' :userId, 
        'description' :e.target.description.value,
        'is_active' :false,
      })
    });
    if (response.status === 200) {
      alert("Successfully created a new Auction!")
    } else {
      alert("Something went wrong!");
    }

  }; 

  let fetchCategories = async() => {
    let response = await fetch('https://127.0.0.1:8000/api/categories/', {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':String(accessToken)
    },
    })
    let data = await response.json()
    if (response.status === 200) { 
      setCategories2(data)  
    }
    else {
      alert("Could not get Categories from the backend"); 
    }
  }

  
  let handleCategoryChange = (e) => {
    setCategories3(e.target.value);
  };

  let finalcategory = categories3 

  let getAuctions = async() =>{
    let response = await fetch('https://127.0.0.1:8000/api/auctions/', {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':String(accessToken)
        }
    })
    let data = await response.json()
    if(response.status === 200 && (isSeller || isBidder)){
        setAuctions(data)
    }else {
        alert("Could not import auctions from the api.") 
    }
}



  return (

    <div>  
      <h1>Auction Manage</h1> 
    {isSeller && 
    <> 
      <Button variant="primary" onClick={handleShow}>
        Create New Auction 
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Auction Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={createAuction}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter name of item."
              />
            </FormGroup>
            <FormGroup>
              <Label for="buy_price">Buy Price</Label>
              <Input
                type="number"
                name="buy_price"
                placeholder="Enter the buying price of the item."
              />
            </FormGroup>
            <FormGroup>
              <Label for="first_bid">Minimum First Bid</Label>
              <Input
                type="text"
                name="first_bid"
                placeholder="Enter the minimum first bid amount."
              />
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Input
                type="text"
                name="location"
                placeholder="Enter location of the item."
              />
            </FormGroup>
            <FormGroup>
              <Label for="country">Country</Label>
              <Input
                type="text"
                name="country"
                placeholder="Enter the country of the item."
              />
            </FormGroup>
            <FormGroup>
              <Label for="latitude">Latitude</Label>
              <Input
                type="text"
                name="latitude"
                placeholder="Enter the latitude of the location."
              />
            </FormGroup>
            <FormGroup>
              <Label for="longitude">Longitude</Label>
              <Input
                type="text"
                name="longitude"
                placeholder="Enter the longitude of the location."
              />
            </FormGroup>
            <FormGroup>
              <Label for="started">Started</Label>
              <Input
                type="date" step="any"
                name="started"
                placeholder="Enter the date that the auction will begin."
              />
            </FormGroup>
            <FormGroup>
              <Label for="ends">Ending</Label>
              <Input
                type="date"
                name="ends"
                placeholder="Enter the date that the auction will end."
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                placeholder="Enter a description for the item."
              />
            </FormGroup>
            <select onChange={handleCategoryChange}>
        <option value="Select a Category"> -- Select a category -- </option>
        {categories2 && categories2.map((category) => (
          <option key={category.value}>{category.name}</option>
        ))} 
      </select>
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
    }

<div>
  <br></br>
  <h5>Open Auctions:</h5>
    <div className='item-container'>
        {auctions && auctions.filter(auction => (auction.seller===userId) && (auction.isOpen===true)).map((fauction) => (
          <div className='card' key={fauction.id}>
            <h3>{fauction.name}</h3>
            <p>{fauction.description}</p>
            <Link to={`/auctionsmanage/${fauction.id}`}>See more </Link>  
          </div>
        ))}
      </div>
      <br></br>
      <br></br>
      <h5>Closed Auctions:</h5>
      <div className='item-container'>
        {auctions && auctions.filter(auction => (auction.seller===userId) && (auction.isOpen===false)).map((fauction) => (
          <div className='card' key={fauction.id}>
            <h3>{fauction.name}</h3>
            <p>{fauction.description}</p>
            <Link to={`/auctionsmanage/${fauction.id}`}>See more </Link>  
          </div>
        ))}
      </div>
    </div>
  </div>
    
  )
        
}

export default AuctionManage