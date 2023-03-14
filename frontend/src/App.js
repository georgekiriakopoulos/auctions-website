
import './App.css';
import Header from './components/Header'
import HomePage from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import UsersList from './components/UsersList';
import AuctionManage from './components/AuctionManage'
import AuctionSearch from './components/AuctionSearch' 
import SingleAuction from './components/SingleAuction' 
import Inbox from './components/Inbox';
import Sent from './components/Sent';

import {Route, BrowserRouter as Router, Routes, Switch} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from "./utils/PrivateRoute";
import Messaging from './components/Messaging';

function App() {
  return (
    <div className="App"> 
      <Router>
        <AuthProvider>
          <Header /> 
            <Switch> 
              <Route component={HomePage} path="/home" /> 
              <Route component={Register} path="/register" />
              <Route component={Login} path="/login" />
              <PrivateRoute component={UsersList} path="/userslist" exact/>
              <Route component={AuctionSearch} path="/auctionsearch" exact/>  
              <Route component={AuctionManage} path="/auctionmanage" exact />
              <Route component={SingleAuction} path="/auctionsmanage/:id" exact />
              <PrivateRoute component={Messaging} path="/messaging" exact/>  
              <PrivateRoute component={Inbox} path="/inbox" exact/>  
              <PrivateRoute component={Sent} path="/sent" exact/>  
            </Switch>
        </AuthProvider>
      </Router>
    </div>
   
  ); 
}

export default App; 