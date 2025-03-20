import React, { useState, useEffect, useRef, useContext } from "react";
import { EditableField } from "./editableField";
import { AuthContext } from "../../../AuthContext";
import { useParams } from "react-router";


export function Profile({ detailsData }) {
    //const [view, setView] = useState(false)
    const { info } = detailsData
    const sectionRef = useRef(null)
    const [newInfo, setNewInfo] = useState({})
    const [modify, setModify] = useState(false)
    const [authUrl, setAuthUrl] = useState("")
    const [newColor, setNewColor] = useState({
        bleu: info.bleu,
        vert: info.vert,
        jaune: info.jaune,
        rouge: info.rouge
    })
    const [newArch, setNewArch] = useState({
        hero: info.hero,
        sage: info.sage,
        magicien: info.magicien,
        explorateur: info.explorateur,
        protecteur: info.protecteur,
        bouffon : info.bouffon,
        souverain: info.souverain,
        createur: info.createur,
        citoyen: info.citoyen,
        amoureuse: info.amoureuse,
        rebelle: info.rebelle,
        optimiste: info.optimiste,
    })
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'
    const { user } = useContext(AuthContext)
    const { clientid } = useParams()
    const queryString = window.location.search;
    const { archetypeImage } = useContext(AuthContext)

    const urlParams = new URLSearchParams(queryString);

    const authValue = urlParams.get("auth"); // "true" ou null s’il n’y a pas "auth"


    useEffect(() => {
        const fetchAuthUrl = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/canva/authurl/`, {
                    methode: "GET",
                    credentials: 'include',
                });
                const data = await response.json()
                console.log("authUrl", authUrl)


                setAuthUrl(data.authURL)
            } catch (error) {
                console.error("error fetching authurl", error)
            }
        };

        fetchAuthUrl();
    }, []);

    /*const handleClick = () => {
        setView(!view)
        setTimeout(() => {
           
        if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" })
        }},100)
    }*/
    const getArchImage = (num) => {
        
        if (num === 1) {
            return archetypeImage(info.archnum1)
        }
        if (num === 2) {
            return archetypeImage(info.archnum2)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewColor(prev => ({ ...prev, [name]: Number(value) }));


    }

    const handleChangeArch = (e) => {
        const { name, value } = e.target
        setNewArch(prev => ({ ...prev, [name]: Number(value) }));


    }

    if (!detailsData.info.profile_id) {
        return (
            <h3>Il n'y pas de profil présentement disponible!</h3>
        )
    }

    const handleModify = async () => {
        const accepted = window.confirm("Êtes-vous sûr de vouloir modifier ?")

        if (!accepted) {
            return
        }
        try {
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/profileUpdate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    value: newColor,
                    profile_id: info.profileid
                })
            });
            if (response.ok) {
                console.log("succesfully updated profile")
                setModify(false)
            }

        } catch (error) {
            console.log("couldn't modify profile", error)
        }
    }

    const handleModifyArch = async () => {
        const accepted = window.confirm("Êtes-vous sûr de vouloir modifier ?")

        if (!accepted) {
            return
        }
        try {
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/profileUpdate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    value: newArch,
                    profile_id: info.profileid
                })
            });
            if (response.ok) {
                console.log("succesfully updated profile")
                setModify(false)
            }

        } catch (error) {
            console.log("couldn't modify profile", error)
        }


    }

    const handleCanva = async (e) => {
        e.preventDefault();
        const currentURL = window.location.href;  // URL actuelle
        const authURLWithState = `${authUrl}&state=${encodeURIComponent(currentURL)}`
        window.location.href = authURLWithState;
    }



    const generateCanva = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/${clientid}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                console.log("here's Details", data)
                const info = data.info
                console.log("here's Info", info)
                try {
                    console.log("trying to create canva")
                    const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/canva/${clientid}`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(info)
                    })
                    if (response.ok) {
                        console.log("successfully autofill Canva")
                    }
                } catch (error) {
                    console.log("couldn't connect canva")
                }

            } else {
                const errorText = await response.text();
                console.error("Error response from server:", errorText)
            };
        } catch (error) {
            console.error("Could not connect to get details data", error)
        }
    }

    return (
        <div className="profile">
            {!authValue ? <button onClick={handleCanva}>Connecter Canva</button> : null}
            {authValue ? <button onClick={generateCanva}>Générer template Canva</button> : null}

            <h2 >Profil Synergia :</h2>
            <h4>Couleurs:</h4>
            <div className="couleur">
                {modify ?
                    <>
                        <h6 className="bleu">Bleu</h6>
                        <h6 className="vert">Vert</h6>
                        <h6 className="jaune">Jaune</h6>
                        <h6 className="rouge">Rouge</h6>
                        <input name="bleu" value={newColor.bleu} onChange={handleChange} />
                        <input name="vert" value={newColor.vert} onChange={handleChange} />
                        <input name="jaune" value={newColor.jaune} onChange={handleChange} />
                        <input name="rouge" value={newColor.rouge} onChange={handleChange} />
                        <button onClick={handleModify} >Modifier</button>
                        <button onClick={() => setModify(false)}>Annuler</button>
                    </> :
                    <>
                        <h6 onClick={() => setModify(true)} className="bleu">Bleu</h6>
                        <h6 onClick={() => setModify(true)} className="vert">Vert</h6>
                        <h6 onClick={() => setModify(true)} className="jaune">Jaune</h6>
                        <h6 onClick={() => setModify(true)} className="rouge">Rouge</h6>
                        <p onClick={() => setModify(true)}>{newColor.bleu}</p>
                        <p onClick={() => setModify(true)}>{newColor.vert}</p>
                        <p onClick={() => setModify(true)}>{newColor.jaune}</p>
                        <p onClick={() => setModify(true)}>{newColor.rouge}</p>
                    </>}


            </div>
            <h4>Archetypes:</h4>
            <div className="archetypep">
                {modify ?
                    <>
                        <h6 >Héro</h6>
                        <h6 >Sage</h6>
                        <h6 >Magicien</h6>
                        <h6 >Explorateur</h6>
                        <h6 >Protecteur</h6>
                        <h6 >Bouffon</h6>
                        <h6 >Souverain</h6>
                        <h6 >Créateur</h6>
                        <h6 >Citoyen</h6>
                        <h6 >Amoureuse</h6>
                        <h6 >Rebelle</h6>
                        <h6 >Optimiste</h6>
                        <input name="hero" value={newArch.hero} onChange={handleChangeArch} />
                        <input name="sage" value={newArch.sage} onChange={handleChangeArch} />
                        <input name="magicien" value={newArch.magicien} onChange={handleChangeArch} />
                        <input name="explorateur" value={newArch.explorateur} onChange={handleChangeArch} />
                        <input name="protecteur" value={newArch.protecteur} onChange={handleChangeArch} />
                        <input name="bouffon" value={newArch.bouffon} onChange={handleChangeArch} />
                        <input name="souverain" value={newArch.souverain} onChange={handleChangeArch} />
                        <input name="createur" value={newArch.createur} onChange={handleChangeArch} />
                        <input name="citoyen" value={newArch.citoyen} onChange={handleChangeArch} />
                        <input name="amoureuse" value={newArch.amoureuse} onChange={handleChangeArch} />
                        <input name="rebelle" value={newArch.rebelle} onChange={handleChangeArch} />
                        <input name="optimiste" value={newArch.optimiste} onChange={handleChangeArch} />
                        <button onClick={handleModifyArch} >Modifier</button>
                        <button onClick={() => setModify(false)}>Annuler</button>
                    </> :
                    <>
                        <h6 onClick={() => setModify(true)} >Hero</h6>
                        <h6 onClick={() => setModify(true)} >Sage</h6>
                        <h6 onClick={() => setModify(true)} >Magicien</h6>
                        <h6 onClick={() => setModify(true)} >Explorateur</h6>
                        <h6 onClick={() => setModify(true)} >Protecteur</h6>
                        <h6 onClick={() => setModify(true)} >Bouffon</h6>
                        <h6 onClick={() => setModify(true)} >Souverain</h6>
                        <h6 onClick={() => setModify(true)} >Créateur</h6>
                        <h6 onClick={() => setModify(true)} >Citoyen</h6>
                        <h6 onClick={() => setModify(true)} >Amoureuse</h6>
                        <h6 onClick={() => setModify(true)} >Rebelle</h6>
                        <h6 onClick={() => setModify(true)} >Optimiste</h6>
                        <p onClick={() => setModify(true)}>{newArch.hero}</p>
                        <p onClick={() => setModify(true)}>{newArch.sage}</p>
                        <p onClick={() => setModify(true)}>{newArch.magicien}</p>
                        <p onClick={() => setModify(true)}>{newArch.explorateur}</p>
                        <p onClick={() => setModify(true)}>{newArch.protecteur}</p>
                        <p onClick={() => setModify(true)}>{newArch.bouffon}</p>
                        <p onClick={() => setModify(true)}>{newArch.souverain}</p>
                        <p onClick={() => setModify(true)}>{newArch.createur}</p>
                        <p onClick={() => setModify(true)}>{newArch.citoyen}</p>
                        <p onClick={() => setModify(true)}>{newArch.amoureuse}</p>
                        <p onClick={() => setModify(true)}>{newArch.rebelle}</p>
                        <p onClick={() => setModify(true)}>{newArch.optimiste}</p>
                    </>}


            </div>


            <h4>Vos deux principaux archétypes:</h4>
            <div className="archetype">

                <p>{info.archnum1}</p>
                <p>{info.archnum2}</p>
                <img className="imgSmall !h-[200px] !w-[200px]" src={getArchImage(1)} alt="archétype#1" />
                <img className="imgSmall !h-[200px] !w-[200px]" src={getArchImage(2)} alt="archétype#2" />

            </div>
            <div className="texteProfile">
                <EditableField
                    label="En bref"
                    name="enbref"
                    value={info.enbref}
                    profileId={info.profileid}
                />


                <EditableField
                    label="Tes forces mis en lumière:"
                    name="forcesenlumieres"
                    value={info.forcesenlumieres}
                    profileId={info.profileid}
                />

                <EditableField
                    label="Tes défis portentiels:"
                    name="defispotentiels"
                    value={info.defispotentiels}
                    profileId={info.profileid}
                />

                <EditableField
                    label="Perception du changement:"
                    name="perceptionchangement"
                    value={info.perceptionchangement}
                    profileId={info.profileid}
                />

                <EditableField
                    label="Perception des relations interpersonnelles :"
                    name="relationsinterpersonnelles"
                    value={info.relationsinterpersonnelles}
                    profileId={info.profileid}
                />

                <EditableField
                    label="Perception de la structure et de la prévisibilité :"
                    name="perceptionstructure"
                    value={info.perceptionstructure}
                    profileId={info.profileid}
                />

                <EditableField
                    label="Perceptions des défis, problèmes et difficultés :"
                    name="perceptionproblemes"
                    value={info.perceptionproblemes}
                    profileId={info.profileid}
                />


                <h4>Tes archétypes</h4>
                <EditableField
                    label="Tes motivations naturelle :"
                    name="motivationsnaturelles"
                    value={info.motivationsnaturelles}
                    profileId={info.profileid}
                />

                <EditableField
                    label=""
                    name="archnum1"
                    value={info.archnum1}
                    profileId={info.profileid}
                />

                <EditableField
                    label=""
                    name="textarch1"
                    value={info.textarch1}
                    profileId={info.profileid}
                />

                <EditableField
                    label=""
                    name="archnum2"
                    value={info.archnum2}
                    profileId={info.profileid}
                />

                <EditableField
                    label="En bref"
                    name="textarch2"
                    value={info.textarch2}
                    profileId={info.profileid}
                />

                <EditableField
                    label="Toi et le marché du travail"
                    name="toitravail"
                    value={info.toitravail}
                    profileId={info.profileid}
                />

                <EditableField
                    label="S'adapter au rouge"
                    name="adapterouge"
                    value={info.adapterouge}
                    profileId={info.profileid}
                />

                <EditableField
                    label="S'adapter au bleu"
                    name="adaptebleu"
                    value={info.adaptebleu}
                    profileId={info.profileid}
                />

                <EditableField
                    label="S'adapter au vert"
                    name="adaptevert"
                    value={info.adaptevert}
                    profileId={info.profileid}
                />

                <EditableField
                    label="S'adapter au jaune"
                    name="adaptejaune"
                    value={info.adaptejaune}
                    profileId={info.profileid}
                />




            </div>



        </div>
    )
}