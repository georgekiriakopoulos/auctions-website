import React, {useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import jwtDecode from 'jwt-decode';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Table from 'react-bootstrap/Table';
import {
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";


function SingleAuction() {
let {user,authTokens} = useContext(AuthContext);
let {loggedUser,setLoggedUser} = useState(); 
let [auction,setAuction] = useState(false); 
let [bid,setBid] = useState(auction.bids);  
let [bids,setBids] = useState(); 
let [bidName,setBidName] = useState(); 
let [bidAmount,setBidAmount] = useState(); 
let [acceptedBid,setAcceptedBid] = useState(); 

let [newName,setNewName] = useState(auction.name);  
let [newBP,setNewBP] = useState(auction.buy_price);
let [newMFB,setNewMFB] = useState(auction.first_bid);
let [newLocation,setNewLocation] = useState(auction.location);
let [newCountry,setNewCountry] = useState(auction.country);
let [newLatitude,setNewLatitude] = useState(auction.latitude);
let [newLongitude,setNewLongitude] = useState(auction.longitude);
let [newStarted,setNewStarted] = useState(auction.started);
let [newEnding,setNewEnding] = useState(auction.ends);
let [newDescription,setNewDescription] = useState(auction.description);

const [show, setShow] = useState(false);
let {id} = useParams(); 

let isOpen = true;
let closingAuction = false;  

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


const handleClose = () => setShow(false);
const handleShow = () => setShow(true);


const showModal = () => {
  setShow(true);
}


const handleNameChange = event => {
  setNewName(event.target.value); 
}
const handleBPChange = event => {
  setNewBP(event.target.value); 
}
const handleMFBChange = event => {
  setNewMFB(event.target.value); 
}
const handleLocationChange = event => {
  setNewLocation(event.target.value); 
}
const handleCountryChange = event => {
  setNewCountry(event.target.value); 
}
const handleLatitudeChange = event => {
  setNewLatitude(event.target.value); 
}
const handleLongitudeChange = event => {
  setNewLongitude(event.target.value); 
}
const handleStartedChange = event => {
  setNewStarted(event.target.value); 
}
const handleEndingChange = event => {
  setNewEnding(event.target.value); 
}
const handleDescriptionChange = event => {
  setNewDescription(event.target.value); 
}
const handleBidNameChange = event => {
  setBidName(event.target.value);
}
const handleBidAmountChange = event => {
  setBidAmount(event.target.value);
}


useEffect(() => {
  createVisit(); 
  getAuction();
  editAuction();
  createBid();
  getBids(); 
  acceptBid();
  closeAuction(); 
} ,[])


let acceptBid = async(bid) => {
  let response = await fetch(`https://127.0.0.1:8000/api/bids/${bid.id}`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      'Authorization':String(accessToken)
    },
    body: JSON.stringify({
      'name':bid.name,  
      'userid':bid.userid,
      'auctionid':bid.auctionid,
      'time':bid.time,
      'amount':bid.amount,
      'accepted': true
    })
  });
  let data = await response.json(); 
  if (response.status === 200) {
    alert("Accepted bid")
    closingAuction = true 
    let winnerid = bid.userid
    closeAuction(winnerid)
  } else {
  }
}

let closeAuction = async (winnerid) => {
  if (closingAuction && winnerid) {
  let response = await fetch(`https://127.0.0.1:8000/api/auctions/${auction.id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization':String(accessToken)
    },
    body: JSON.stringify({
      'name':newName,        
      'categories':auction.categories,   
      'winner': winnerid,
      'buy_price':newBP,
      'first_bid' :newMFB,
      'location' :newLocation,
      'country' :newCountry,
      'latitude' :newLatitude,
      'longitude' :newLongitude,
      'started' :newStarted,
      'ends' :newEnding,
      'seller' :auction.seller,  
      'description' :newDescription,
      'isOpen': false,
    })
  });
  if (response.status === 200) {
    alert("Successfully closed the Auction!")
  } else {
  }
}
}

const editAuction = async (e) => {
  e.preventDefault() 
  let response = await fetch(`https://127.0.0.1:8000/api/auctions/${auction.id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization':String(accessToken)
    },
    body: JSON.stringify({
      'name':newName,        
      'categories':auction.categories,   
      'buy_price':newBP,
      'first_bid' :newMFB,
      'location' :newLocation,
      'country' :newCountry,
      'latitude' :newLatitude,
      'longitude' :newLongitude,
      'started' :newStarted,
      'ends' :newEnding,
      'seller' :auction.seller,  
      'description' :newDescription,
    })
  });
  if (response.status === 200) {
    alert("Successfully edited the Auction!")
  } else {
    alert("Something went wrong!");
  }
}

const deleteAuction = async (e) => {
  e.preventDefault() 
  let response = await fetch(`https://127.0.0.1:8000/api/auctions/${auction.id}/`, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      'Authorization':String(accessToken)
    }
  });
  if (response.status === 200) {
    alert("Successfully deleted the Auction!")
  } else {
    alert("Something went wrong!");
  }
}

  let getAuction = async() => {
    let response = await fetch(`https://127.0.0.1:8000/api/auctions/${id}`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':String(accessToken)
    },
    })
    let data = await response.json()
    if (response.status === 200) { 
      setAuction(data) 
    }
    else {
      alert("Error at getting single auction from the backend");  
    }
  }

  let createVisit = async() => {
    let response = await fetch(`https://127.0.0.1:8000/api/visits/`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':String(accessToken)
    },
    body: JSON.stringify({
      'visitor':userId,
      'visitedAuction': id       
    })
    })
    let data = await response.json()
    if (response.status === 200) { 
    }
    else {
      alert("Error at adding visitor to the auction.");  
    }
  }
  

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;            //Get current date to create a new bid.

  let createBid = async(e) => {
    e.preventDefault(); 
    let response = await fetch("https://127.0.0.1:8000/api/bids/", {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':String(accessToken)
    },
    body: JSON.stringify({
      'name':e.target.name.value,  
      'userid':userId,
      'auctionid':auction.id,
      'time':date,
      'amount':bidAmount
    })
    });
    let data = await response.json()
    if (response.status === 200) { 
      setBid(data);  
      alert("Successfully created a new Bid.")
  }
}
 


  let getBids = async() => {
    let response = await fetch(`https://127.0.0.1:8000/api/bids/`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':String(accessToken)
    },
    })
    let data = await response.json()
    if (response.status === 200) { 
      setBids(data) 
    }else{
      alert("Can't fetch bids from api.")
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

  let rows=0;
  var currentArray = []; 
  let numofbid = <td>{bids?.filter(bids => (bids.auctionid === auction.id)).map(filteredBids => (
    rows++,
    currentArray.push(filteredBids.amount) 
  ))}</td>
  let numberOfBids = rows; 
  const maximumCurrent = Math.max(...currentArray)              //Get biggest current bid

return (
<div className="container"> 
{auction  
 &&
<div className='specific-container'> 
  <h4 className="p-2 text-center">{auction.name}</h4>
    <Table className="table table-striped table-bordered" responsive>
    <thead>
          <tr>
          {isBidder &&
              <th>Make a bid </th>}
              <th>Id</th>
              <th>Name</th>
              <th>Category</th>
              <th>Currently</th>
              <th>Buy Price</th>
              <th>First Bid</th>
              <th>Number of Bids</th>
              <th>Bids</th>   
              <th>Location</th>
              <th>Country</th>
              <th>Started</th>
              <th>Ends</th>
              <th>Seller</th>
              <th>Description</th>
              {userId ===  auction.seller &&
              <th>Edit</th>
              }
              {userId === auction.seller &&
              <th>Delete</th> 
              }

              </tr>
      </thead>
  <tbody>
    <tr key={auction.id}> 
    {isBidder &&
      <td> 
      <Form onSubmit={createBid}>
          Title:
          <Input 
          type="text" 
          name = "name"
          placeholder='Title.'
          onChange={handleBidNameChange} 
        />
        Amount:
        <Input 
        type="number"
        name="amount"
        placeholder='Amount.'
        onChange={handleBidAmountChange}
        />
        <input type="submit" value="Submit" />
      </Form>
      </td>}
    <td>{auction.id}</td>
    <td>{auction.name}</td>
    <td> {auction.categories.name} </td> 
    <td> {maximumCurrent | ""}$ </td> 
    <td> {auction.buy_price}$ </td> 
    <td> {auction.first_bid}$ </td> 
    <td> {numberOfBids} </td> 
    <td>{auction.isOpen && bids.filter(bids => (bids.auctionid === auction.id)).map(filteredBids => (
      <p>{filteredBids.amount}$ by userid:{filteredBids.userid} 
      {userId===auction.seller && <Button variant="success" size="sm" onClick={(e) => acceptBid(filteredBids)}>Accept</Button>}</p>  
    ))}</td>
    <td> {auction.location} </td> 
    <td> {auction.country} </td> 
    <td> {auction.started} </td> 
    <td> {auction.ends} </td> 
    <td> {auction.seller} </td> 
    <td> {auction.description} </td> 
    {userId === auction.seller && 
    <td> <> <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Auction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={editAuction}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter name of item."
                defaultValue = {auction.name} 
                onChange = {handleNameChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="buy_price">Buy Price</Label>
              <Input
                type="number"
                name="buy_price"
                placeholder="Enter the buying price of the item."
                defaultValue={auction.buy_price}
                onChange = {handleBPChange} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="first_bid">Minimum First Bid</Label>
              <Input
                type="text"
                name="first_bid"
                placeholder="Enter the minimum first bid amount."
                defaultValue={auction.first_bid}
                onChange = {handleMFBChange} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Input
                type="text"
                name="location"
                placeholder="Enter location of the item."
                defaultValue={auction.location}
                onChange = {handleLocationChange} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="country">Country</Label>
              <Input
                type="text"
                name="country"
                placeholder="Enter the country of the item."
                defaultValue={auction.country}
                onChange = {handleCountryChange} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="latitude">Latitude</Label>
              <Input
                type="text"
                name="latitude"
                placeholder="Enter the latitude of the location."
                defaultValue={auction.latitute}
                onChange = {handleLatitudeChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="longitude">Longitude</Label>
              <Input
                type="text" 
                name="longitude"
                placeholder="Enter the longitude of the location."
                defaultValue={auction.longitude}
                onChange = {handleLongitudeChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="started">Started</Label>
              <Input
                type="date"
                name="started"
                placeholder="Enter the date that the auction will begin."
                defaultValue = {auction.started}
                onChange = {handleStartedChange} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="ends">Ending</Label>
              <Input
                type="date"
                name="ends"
                placeholder="Enter the date that the auction will end."
                defaultValue={auction.ends} 
                onChange = {handleEndingChange} 
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                placeholder="Enter a description for the item."
                defaultValue={auction.description}
                onChange = {handleDescriptionChange} 
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
      </td>
      }
      {userId === auction.seller && 
      <td><Button variant="danger" onClick={deleteAuction}>Delete</Button></td>
      }
    
    </tr>
  </tbody>
</Table>
<MapContainer center={[auction.latitude,auction.longitude]} zoom={13} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[auction.latitude,auction.longitude]}>
  </Marker>
</MapContainer>
</div> 
} 
<br></br>
<br></br>
{(auction) && (auction.isOpen===false) && (auction.seller===userId) &&                          // If auction is closed seller can contact the winner.
<div className='contact'>
  <h3> Contact the Winner </h3>
  <Form onSubmit={createMessage}>
            <FormGroup>
                <Label for="closedAuction">For Auction:</Label>
                <Input
                type="text"
                name="closedAuction"
                placeholder=""
                defaultValue = {auction.name} 
              />
            </FormGroup>
            <FormGroup>
                <Label for="sender">By:</Label>
                <Input
                type="text"
                name="sender"
                placeholder=""
                defaultValue = {userId} 
              />
            </FormGroup>
            <FormGroup>
                <Label for="receiver">Reply to winner with user id:</Label>
                <Input
                type="text"
                name="receiver"
                placeholder=""
                defaultValue = {auction.winner} 
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
</div>
}
</div>      
)
}

export default SingleAuction