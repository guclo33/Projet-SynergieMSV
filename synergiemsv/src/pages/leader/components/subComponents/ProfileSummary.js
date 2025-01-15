import React, {useContext} from "react";
import { LeaderContext } from "../../LeaderContext";
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { ChartComponent } from "./ChartComponent";


export function ProfileSummary() {
    const {leaderData, profilePhotos} = useContext(LeaderContext)
    const {info, profile, equipe, equipeProfiles} = leaderData

    if(!leaderData || !leaderData.info || !info) {
        return <div>Loading...</div>
    }
   
    let image1 = ""
    switch (profile.archNum1.toLowerCase()) {
        case "héro" || "héros":
            image1 = "";
            break;
        case "explorateur" || "explorateurs" || "exploratrice" || "exploratrices":
            image1 = "";
            break;
        case "amoureux" || "amoureuse" || "amoureux" || "amoureuses":
            image1 = "";
            break;
        case "sage" || "sages":
            image1 = "";
            break;
        case "rebelle" || "rebelles" || "rebel" || "rebels":
            image1 = "";
            break;
        case "bouffon" || "bouffons":
            image1 = "";
            break;
        case "magicien" || "magicienne" || "magiciens" || "magiciennes":
            image1 ="";
            break;
        case "créateur" || "créatrice" || "créateurs" || "créatrices":
            image1 = "";
            break;
        case "citoyen" || "citoyenne" || "citoyens" || "citoyennes":
            image1 = "";
            break;
        case "optimiste" || "optimistes":
            image1 = "";
            break;
        case "protecteur" || "protectrice" || "protecteurs" || "protectrices":
            image1 = "";
            break;
        case "souverain" || "souveraine" || "souverains" || "souveraines":
            image1 = "";
            break;
        default:
            image1 = "";
            break;

    }

    let image2 = ""
    switch (profile.archNum2.toLowerCase()) {
        case "héro" || "héros":
            image2 = "";
            break;
        case "explorateur" || "explorateurs" || "exploratrice" || "exploratrices":
            image2 = "";
            break;
        case "amoureux" || "amoureuse" || "amoureux" || "amoureuses":
            image2 = "";
            break;
        case "sage" || "sages":
            image2 = "";
            break;
        case "rebelle" || "rebelles" || "rebel" || "rebels":
            image2 = "";
            break;
        case "bouffon" || "bouffons":
            image2 = "";
            break;
        case "magicien" || "magicienne" || "magiciens" || "magiciennes":
            image2 ="";
            break;
        case "créateur" || "créatrice" || "créateurs" || "créatrices":
            image2 = "";
            break;
        case "citoyen" || "citoyenne" || "citoyens" || "citoyennes":
            image2 = "";
            break;
        case "optimiste" || "optimistes":
            image2 = "";
            break;
        case "protecteur" || "protectrice" || "protecteurs" || "protectrices":
            image2 = "";
            break;
        case "souverain" || "souveraine" || "souverains" || "souveraines":
            image2 = "";
            break;
        default:
            image2 = "";
            break;

    }

    

    console.log("info", info)

    return (
        <div className="profileSummary">
            <img className="imgBig" src={profilePhotos[info.nom_client] || iconeProfile} alt={info.nom_client} />
            <ChartComponent bleu={profile.bleu} rouge={profile.rouge} vert={profile.vert} jaune={profile.jaune}/>
            <img src={image1} alt={profile.archNum1} />
            <img src={image2} alt={profile.archNum2} />

        </div>
    )
}