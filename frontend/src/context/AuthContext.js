import { createContext, useState, useEffect} from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext; 

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true) 

    const history = useHistory() 

    let loginUser = async (e)=> {
        e.preventDefault()
        let response = await fetch('https://127.0.0.1:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
            'username':e.target.username.value, 
            'password':e.target.password.value,
        }) 
        })
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens()
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            history.push('/home')
        }else{
            alert('Error at loggin user in!')
        }
    }

    const registerUser = async (e) => {
        e.preventDefault() 
        let response = await fetch("https://127.0.0.1:8000/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            'username':e.target.username.value, 
            'password':e.target.password.value, 
            'password2':e.target.password2.value,
            'name' :e.target.name.value,
            'surname' :e.target.surname.value,
            'mobile_phone' :e.target.mobile_phone.value,
            'email' :e.target.email.value,
            'address' :e.target.address.value,
            'scn' :e.target.scn.value,
            'is_seller' :e.target.is_seller.value,
            'is_bidder' :e.target.is_bidder.value,
            'is_accepted' :false           
          })
        });
        if (response.status === 201) {
          history.push("/login");
          alert("Your registration has been completed successfully. Please wait until we accept your application.")
        } else {
          alert("Something went wrong!");
        }
      };

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)            
        localStorage.removeItem('authTokens')
        history.push('/login') 
    }

    let updateToken = async () => {
        let response = await fetch('https://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })
        let data = await response.json()

        if (response.status === 200){
            setAuthTokens()
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data)) 
        }else {
            logoutUser() 
        }
        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        registerUser:registerUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=> {
        let thirtyMinutes = 1000 * 60 * 30
        let interval = setInterval(() => {
            if(authTokens){
                updateToken()
            }
        }, thirtyMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}
