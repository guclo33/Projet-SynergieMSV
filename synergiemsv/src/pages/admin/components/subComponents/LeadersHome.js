import React, {useState} from "react";
import { Link } from "react-router-dom";
import "../../../pages.css"

export function LeadersHome ({ adminHomeData})  {
    const [active, setActive] = useState(true)

    const handleCheck = () =>{
        
        setActive(!active)
        
        
    }

    const leadersActif = adminHomeData.filter(leader => leader.active !== undefined && leader.active === active);

    return (
        <div className="leadersHome">
            <h2>Mes leaders!</h2>
             <div className="input">  
                <input id = "active" type="checkbox" checked={!active} onChange={handleCheck} />
                <label htmlFor="active">Voir les leaders inactifs</label>
            </div> 
            {leadersActif.map((leader) => (
                <div className="leaderHome" key={leader.id}>   
                    <div className="info">
                        <h4>Leader</h4>
                        <p><Link to={`roadmap/${leader.id}`}>{leader.nom}</Link></p>
                    </div>
                    <div className="info">
                        <h4>Courriel</h4>
                        <p>{leader.email}</p>
                    </div>
                    <div className="info">
                        <h4>Téléphone</h4>
                        <p>{leader.phone || "non enregistré"} </p>
                    </div>
                    <div className="info">
                        <h4>Status</h4>
                        {leader.active ? <p>Actif</p> : <p>Inactif</p>}
                    </div>
                </div>   
            ))}
        </div>
    );
}

