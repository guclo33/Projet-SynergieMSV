import React, {useEffect, useState, useContext} from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../../AuthContext";
import "../../../pages.css"


export function ProfilGenerator() {
    const [canvaAuth, setCanvaAuth] = useState(false)
    const [authURL, setAuthURL] = useState("")
    const [profilName, setProfilName] = useState({
        firstName : "",
        lastName : ""
    });
    const [message, setMessage] = useState("")
    const {id} = useParams();
    const {user} = useContext(AuthContext);
    

    useEffect(() =>{
        const fetchAuthUrl= async () =>{
            try{
                const response = await fetch(`http://localhost:3000/api/canva/authurl/`, {
                    methode : "GET",
                    credentials: 'include',
                });
                const data = await response.json()

                

                setAuthURL(data.authURL)
            }catch(error){
                console.error("error fetching authurl", error)
        }};

        fetchAuthUrl();
    },[]);

    

    useEffect(()=> {
        const params = new URLSearchParams(window.location.search);
        const auth = params.get("auth")

        if(auth==="true"){
            setCanvaAuth(true)
        } 
    },[])

    const handleCanva = async (e) =>{
        e.preventDefault();
        const currentURL = window.location.href;  // URL actuelle
        const authURLWithState = `${authURL}&state=${encodeURIComponent(currentURL)}`
        window.location.href = authURLWithState;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProfilName((prev)=> ({
            ...prev,
            [name] : value
        }))

    };

    const handleSubmit = async (e)=> {
        e.preventDefault();
        const dataToSend = {
            firstName :profilName.firstName,
            lastName: profilName.lastName
        }
        document.getElementById('loading').style.display = 'block';
        console.log(dataToSend, "params id =", id)
        try {
            const response = await fetch(`http://localhost:3000/api/admin/${id}/profilgenerator`, {
                method: "POST",
                credentials: 'include',
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify( {
                    firstName :profilName.firstName,
                    lastName: profilName.lastName
                })

            });
            if(response.ok){
                const data = await response.json()
                setMessage(data.message)
            } else {
                console.log(`problem sending ${dataToSend}`)
                const error = await response.json()
                setMessage(error.error)
            }
        } catch(error) {
            
            console.error("error submiting profile name", error)
        } finally{
            document.getElementById('loading').style.display = 'none';
        }
    }
    
    if(canvaAuth===false) {
        return (
            <div className="profilGenerator">
                <h2>Générateur de texte</h2>
                <button onClick={handleCanva}>Connect Canva</button>
                
             
            </div>
        )
    }

    


    return(
        <div className="profilGenerator">
            <h2>Générateur de profils</h2>
                <form onSubmit={handleSubmit}>
                    <div className="pGInput">
                        <label htmlFor="prénom">Prénom</label>
                        <input type="text" value={profilName.firstName} name="firstName" onChange={handleChange}/>
                    </div>
                    <div className="pGInput">
                    <label htmlFor="Nom">Nom</label>
                    <input type="text" value={profilName.lastName} name="lastName" onChange={handleChange} />
                    </div>
                    <button>Générer le profil</button>
                </form>
                <div id="loading" style={{display: "none"}}>Loading...</div>
             
        </div>
    )
}

 