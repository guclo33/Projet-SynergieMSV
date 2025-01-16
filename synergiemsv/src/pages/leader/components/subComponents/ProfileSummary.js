import React, {useContext} from "react";
import { LeaderContext } from "../../LeaderContext";
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { ChartComponent } from "./ChartComponent";
import héro from "../../../../Images/archetypes/Héros.webp";
import explorateur from "../../../../Images/archetypes/Explorateur.webp";
import sage from "../../../../Images/archetypes/Sage.webp";
import rebelle from "../../../../Images/archetypes/Rebelle.webp";
import bouffon from "../../../../Images/archetypes/Bouffon.webp";
import magicien from "../../../../Images/archetypes/Magicien.webp";
import créateur from "../../../../Images/archetypes/Créateur.webp";
import citoyen from "../../../../Images/archetypes/Citoyen.webp";
import innocent from "../../../../Images/archetypes/Innocent.webp";
import protecteur from "../../../../Images/archetypes/Protecteur.webp";
import souverain from "../../../../Images/archetypes/Souverain.webp";
import amoureuse from "../../../../Images/archetypes/amoureuse.webp";



export function ProfileSummary() {
    const {leaderData, profilePhotos} = useContext(LeaderContext)
    const {info, profile, equipe, equipeProfiles} = leaderData

    if(!leaderData || !leaderData.info || !info) {
        return <div>Loading...</div>
    }
   
    console.log(String(profile.archnum2).toLowerCase())
    console.log(String(profile.archnum1).toLowerCase())

    let image1 = ""
    switch (String(profile.archnum1).toLowerCase()) {
        case "héro" :
        case "héros" :
            image1 = héro
            break;
        case "explorateur":
        case "explorateurs":
        case "exploratrice":
        case "exploratrices":
            image1 = explorateur;
            break;
        case "amoureux" :
        case "amoureuse" :
        case "amoureux" :
        case "amoureuses":
            image1 = amoureuse;
            break;
        case "sage" :
        case "sages":
            image1 = sage;
            break;
        case "rebelle" :
        case "rebelles" :
        case "rebel" :
        case "rebels":
            image1 = rebelle;
            break;
        case "bouffon" :
        case "bouffons":
            image1 = bouffon;
            break;
        case "magicien" :
        case "magicienne" :
        case "magiciens" :
        case "magiciennes":
            image1 =magicien;
            break;
        case "créateur" :
        case "créatrice" :
        case "créateurs" :
        case "créatrices":
            image1 = créateur;
            break;
        case "citoyen" :
        case "citoyenne" :
        case "citoyens" :
        case "citoyennes":
            image1 = citoyen;
            break;
        case "optimiste" :
        case "optimistes" :
        case "innocent" :
        case "innocente" :
        case "innocents" :
        case "innocentes":
            image1 = innocent;
            break;
        case "protecteur" :
        case "protectrice" :
        case "protecteurs" :
        case "protectrices":
            image1 = protecteur;
            break;
        case "souverain" :
        case "souveraine" :
        case "souverains" :
        case "souveraines":
            image1 = souverain;
            break;
        default:
            image1 = "";
            break;

    }

    let image2 = ""
    switch (String(profile.archnum2).toLowerCase()) {
        case "héro" :
        case "héros" :
            image2 = héro;
            break;
        case "explorateur":
        case "explorateurs":
        case "exploratrice":
        case "exploratrices":
            image2 = explorateur;
            break;
        case "amoureux" :
        case "amoureuse" :
        case "amoureux" :
        case "amoureuses":
            image2 = amoureuse;
            break;
        case "sage" :
        case "sages":
            image2 = sage;
            break;
        case "rebelle" :
        case "rebelles" :
        case "rebel" :
        case "rebels":
            image2 = rebelle;
            break;
        case "bouffon" :
        case "bouffons":
            image2 = bouffon;
            break;
        case "magicien" :
        case "magicienne" :
        case "magiciens" :
        case "magiciennes":
            image2 =magicien;
            break;
        case "créateur" :
        case "créatrice" :
        case "créateurs" :
        case "créatrices":
            image2 = créateur;
            break;
        case "citoyen" :
        case "citoyenne" :
        case "citoyens" :
        case "citoyennes":
            image2 = citoyen;
            break;
        case "optimiste" :
        case "optimistes" :
        case "innocent" :
        case "innocente" :
        case "innocents" :
        case "innocentes":
            image2 = innocent;
            break;
        case "protecteur" :
        case "protectrice" :
        case "protecteurs" :
        case "protectrices":
            image2 = protecteur;
            break;
        case "souverain" :
        case "souveraine" :
        case "souverains" :
        case "souveraines":
            image2 = souverain;
            break;
        default:
            image2 = "";
            break;

    }

    console.log("image1:", image1);
    console.log("image2:", image2)

    

    console.log("info", info)

    return (
        
            
            <div className="profileSummary">
                

                <img className="imgBig" src={profilePhotos[info.nom_client] || iconeProfile} alt={info.nom_client} />
                <ChartComponent height="560" width="180" className="chartContainer" bleu={profile.bleu} rouge={profile.rouge} vert={profile.vert} jaune={profile.jaune}/>
                <div className="arch">
                    <h3>{profile.archnum1 || "Profile non-existant"}</h3>
                    <img src={image1} alt={profile.archnum1} />
                    <h3>{profile.archnum2 || "Profile non-existant"}</h3>
                    <img src={image2} alt={profile.archnum2} />
                </div>

            </div>
            
        
    )
}