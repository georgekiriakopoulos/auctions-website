import React, {useContext, useEffect, useState} from 'react'
import AuthContext from '../context/AuthContext'
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';




function AuctionSearch() {
  let {user,authTokens} = useContext(AuthContext)
  const [auctions,setAuctions] = useState(); 
  const [categories, setCategories] = useState(); 
  const [category, setCategory] = useState(); 
  const [recAuction, setrecAuction] = useState(); 

  if (authTokens) {
    var accessToken = authTokens.access
    var decToken = jwtDecode(accessToken)
    var userId = decToken.user_id 
  }else {
    var accessToken = user
    var userId = user.user_id
  }

  useEffect(() => {
    fetchCategories()
    getAuctions();
    getRecAuction(); 
  } ,[])

  let getAuctions = async() =>{
    let response = await fetch('https://127.0.0.1:8000/api/auctions/', {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':String(accessToken)
        }
    })
    let data = await response.json()
    if(response.status === 200){
        setAuctions(data)
    }else {
        alert("Could not import auctions from the api.") 
    }
}

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
    setCategories(data)  
  }
  else {
    alert("Could not get Categories from the backend"); 
  }
}

let getRecAuction = async() =>{
  let response = await fetch(`https://127.0.0.1:8000/api/recommendedauctions/${userId}`, {
      method:'GET',
      headers:{
          'Content-Type':'application/json',
          'Authorization':String(accessToken)
      }
  })
  let data = await response.json()
  if(response.status === 200){
      setrecAuction(data)
  }else {
      alert("Could not import recommended Auction from the api.") 
  }
}


const [filteredList,setFilteredList] = new useState(auctions)
const filterBySearch = (event) => {
  const query = event.target.value;
  var updatedList = [...auctions];
  updatedList = updatedList.filter((item) => {
    let itemName = item.name
    if (item.isOpen === false) {
      return 
    }
    return itemName?.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
  setFilteredList(updatedList);
};
  return (
    <div>
    <h1>Auction Search</h1> 
    <div className="search-header">
        <div className="search-text">Search:</div>
        <input id="search-box" onChange={filterBySearch} />
      </div>
    <div className='item-container'>
      {filteredList ? filteredList.map((auction) => (
        <div className='card' key={auction.id}>
          <h3>{auction.name}</h3>
          <p>{auction.description}</p>
          <Link to={`/auctionsmanage/${auction.id}`}>See more </Link>
        </div>
      )):
      auctions && auctions.filter(auctions => (auctions.isOpen == true))?.map((auction) => (
        <div className='card' key={auction.id}>
          <h3>{auction.name}</h3>
          <p>{auction.description}</p>
          <Link to={`/auctionsmanage/${auction.id}`}>See more </Link>
        </div>
      ))}
    </div>
    <div className='recommendedAuction'>
        <h4>Recommend Auction:</h4>
        <div className='card' key={recAuction?.id}>
          <h3>{recAuction?.name}</h3>
          <p>{recAuction?.description}</p>
          <Link to={`/auctionsmanage/${recAuction?.id}`}>See more </Link>
        </div>
    </div>
  </div>
  
  )
}

export default AuctionSearch