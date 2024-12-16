import React, {useState, useEffect, useContext} from "react";
import image from "../../Images/logo2 sans fond.png"
import { LoginForm } from "./components/LoginForm";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useLocation } from 'react-router-dom';

export function Login() {
    
    const [userData, setUserData] = useState({
        usernameOrEmail : "",
        password : ""
    })
    const [verified, setVerified] = useState(false);
    const location = useLocation();

    const { login } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if(userData.usernameOrEmail.length > 0 && userData.password.length > 0){
            setVerified(true)
        }
    }, [userData])
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setUserData((prev) =>({
            ...prev,
            [name] : value
        }))
    }

    const handleSubmit= async (e) => {
        e.preventDefault()
        if (verified){
            try {
                console.log('Sending data to backend:', userData);
                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                    })
                ;
                if(response.ok){
                    const data = await response.json();
                    console.log(`User successfully logged in with role: ${data.user.role}`);
                    const user = {
                        id : data.user.id,
                        role : data.user.role,
                        username : data.user.username,
                        email : data.user.email
                    }
                    
                    login(user)

                    navigate(`/${data.user.role}/${data.user.id}`);

                } else {
                    const errorData = await response.json()
                    console.log("error", errorData.message)
                    alert(`Error : ${errorData.message}`)
                }


            } catch(error){
                console.log("user not found")
                alert("Couldn't get user, have you created your account?")
            }
        } else {
            alert("Les champs sont vide!")
        }
    }
    
    return(
        <>
            <nav>
                <ul>
                    
                    <li style={{
          fontWeight: location.pathname === '/' ? 'bold' : 'normal',
        }}><Link to="/">Accueil</Link></li>
                    <li style={{
          fontWeight: location.pathname === '/login' ? 'bold' : 'normal',
        }}><Link to="/login">Se connecter</Link></li>
                    <li style={{
          fontWeight: location.pathname === '/register' ? 'bold' : 'normal',
        }}><Link to="/register">Créer un compte</Link></li>
                    <a href="https://www.synergiemsv.com"><img src={image} alt="logo SynergieMSV" /></a>
                </ul>
            </nav>
            <div className="loginContainer">
                <div className="login">
                    
                    <LoginForm handleSubmit={handleSubmit} handleChange={handleChange} userData={userData}/>
                    
                </div>
            </div>
        </>
    )
}