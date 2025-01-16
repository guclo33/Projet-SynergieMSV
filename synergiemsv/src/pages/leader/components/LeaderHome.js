import React, {useContext }from "react";
import { ProfileSummary } from "./subComponents/ProfileSummary";
import { LeaderContext } from "../LeaderContext";
import iconeProfile from "../../../Images/iconeProfile.jpg"
import { AuthContext } from "../../AuthContext";
import { ChartComponent } from "./subComponents/ChartComponent";

export function LeaderHome() {
    
    const {profilePhotos, leaderData} = useContext(LeaderContext)
    
    const {archetypeImage} = useContext(AuthContext)
    
    const {info, equipe, equipeProfiles} = leaderData
    
    if(!leaderData || !info) {
        return <div>Loading...</div>
    }
    console.log("leaderData =", leaderData)
    console.log("equipeProfile =", equipeProfiles)

    const getArchImage = (name, num) => {
        if(!Array.isArray(equipeProfiles)) {
            return null
        }
        const clientProfile = equipeProfiles.find((profile) => profile.nomclient === name)
        if (!clientProfile) {
            return null;
        }
        if(num === 1) {
            return archetypeImage(clientProfile.archnum1)
        }
        if(num === 2) {
            return archetypeImage(clientProfile.archnum2)
        }      
    }
    

    const getprofileArch = (name, num) => {   
        if(!equipeProfiles) {
            return null
        }
        const clientProfile = equipeProfiles.find((profile) => profile.nomclient === name)
        if (!clientProfile) {
            return null;
        }
        if(num === 1) {
            return clientProfile.archnum1
        }
        if(num === 2) {
            return clientProfile.archnum2
        }  
    }  

    const getColor =(name, color) => {
        if(!equipeProfiles) {
            return null
        }
        const clientProfile = equipeProfiles.find((profile) => profile.nomclient === name)
        if (!clientProfile) {
            return null;
        }
        if(color === "bleu") {
            return clientProfile.bleu
        }
        if(color === "rouge") {
            return clientProfile.rouge
        }
        if (color === "jaune") {
            return clientProfile.jaune
        }
        if (color === "vert") {
            return clientProfile.vert
        } 
    }
    console.log("getProfile Arch =",getprofileArch("Félicia Caux", 1))

    const equipeWithoutLeader = equipe.filter((client) => client.nom !== info.nom_client)

    return (
        <div className="leaderHome">
            <h1>Bienvenue {info.nom_client}</h1>
            <ProfileSummary />
            <h2>Votre Équipe</h2>
            <div className="equipe">

                {equipeWithoutLeader.map((client, index) => (
                    <div key={index} className="teamList">
                        <div className="imgName">
                            <img className="imgSmall" src={profilePhotos[client.nom] || iconeProfile} alt={client.nom} />
                            <h4>{client.nom}</h4>
                        </div>
                        <ChartComponent height="200" width= "100" bleu={getColor(client.nom, "bleu")} rouge={getColor(client.nom, "rouge")} jaune={getColor(client.nom, "jaune")} vert={getColor(client.nom, "vert")} />
                        <div className="smallArch">
                            <h3>{getprofileArch(client.nom, 1) || "Profile non-existant"}</h3>
                            <img src={getArchImage(client.nom, 1)} alt={getprofileArch(client.nom, 1)} />
                            <h3>{getprofileArch(client.nom, 2) || "Profile non-existant"}</h3>
                            <img src={getArchImage(client.nom, 2)} alt={getprofileArch(client.nom, 2)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}