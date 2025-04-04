"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { EditableField } from "./editableField"
import { AuthContext } from "../../../AuthContext"
import { useParams } from "react-router"

export function Profile({ detailsData }) {
  const { info } = detailsData
  const sectionRef = useRef(null)
  const [newInfo, setNewInfo] = useState({})
  const [modify, setModify] = useState(false)
  const [authUrl, setAuthUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newColor, setNewColor] = useState({
    bleu: info.bleu,
    vert: info.vert,
    jaune: info.jaune,
    rouge: info.rouge,
  })
  const [newArch, setNewArch] = useState({
    hero: info.hero,
    sage: info.sage,
    magicien: info.magicien,
    explorateur: info.explorateur,
    protecteur: info.protecteur,
    bouffon: info.bouffon,
    souverain: info.souverain,
    createur: info.createur,
    citoyen: info.citoyen,
    amoureuse: info.amoureuse,
    rebelle: info.rebelle,
    optimiste: info.optimiste,
  })
  const apiUrl = process.env.REACT_APP_RENDER_API || "http://localhost:3000"
  const { user } = useContext(AuthContext)
  const { clientid } = useParams()
  const queryString = window.location.search
  const { archetypeImage } = useContext(AuthContext)

  const urlParams = new URLSearchParams(queryString)
  const authValue = urlParams.get("auth") // "true" ou null s'il n'y a pas "auth"

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/canva/authurl/`, {
          methode: "GET",
          credentials: "include",
        })
        const data = await response.json()
        console.log("authUrl", authUrl)
        setAuthUrl(data.authURL)
      } catch (error) {
        console.error("error fetching authurl", error)
      }
    }

    fetchAuthUrl()
  }, [])

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
    setNewColor((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleChangeArch = (e) => {
    const { name, value } = e.target
    setNewArch((prev) => ({ ...prev, [name]: Number(value) }))
  }

  if (!detailsData.info.profile_id) {
    return <h3>Il n'y pas de profil présentement disponible!</h3>
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: newColor,
          profile_id: info.profileid,
        }),
      })
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: newArch,
          profile_id: info.profileid,
        }),
      })
      if (response.ok) {
        console.log("succesfully updated profile")
        setModify(false)
      }
    } catch (error) {
      console.log("couldn't modify profile", error)
    }
  }

  const handleCanva = async (e) => {
    e.preventDefault()
    const currentURL = window.location.href // URL actuelle
    const authURLWithState = `${authUrl}&state=${encodeURIComponent(currentURL)}`
    window.location.href = authURLWithState
  }

  const generateCanva = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/${clientid}`, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        const info = data.info

        try {
          console.log("trying to create canva")
          const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/canva/${clientid}`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
          })
          if (response.ok) {
            const data = await response.json()
            console.log("here's Canva", data)
            console.log("successfully autofill Canva")
            if (data && data.editUrl) {
              window.open(data.editUrl, "_blank")
            }
            setIsLoading(false)
          }
        } catch (error) {
          console.log("couldn't connect canva")
          setIsLoading(false)
        }
      } else {
        const errorText = await response.text()
        console.error("Error response from server:", errorText)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Could not connect to get details data", error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="profile bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Profil Synergia</h2>
        <div className="space-x-2">
          {!authValue ? (
            <button onClick={handleCanva} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                />
              </svg>
              Connecter Canva
            </button>
          ) : (
            <button onClick={generateCanva} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Générer template Canva
            </button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Couleurs:</h4>
        <div className="couleur-container border border-gray-200 rounded-lg overflow-hidden">
          <div className="couleur grid grid-cols-4 text-center">
            {modify ? (
              <>
                <h6 className="bleu p-2">Bleu</h6>
                <h6 className="vert p-2">Vert</h6>
                <h6 className="jaune p-2">Jaune</h6>
                <h6 className="rouge p-2">Rouge</h6>
                <input
                  name="bleu"
                  value={newColor.bleu}
                  onChange={handleChange}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="vert"
                  value={newColor.vert}
                  onChange={handleChange}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="jaune"
                  value={newColor.jaune}
                  onChange={handleChange}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="rouge"
                  value={newColor.rouge}
                  onChange={handleChange}
                  className="p-2 border-t border-gray-200"
                />
                <div className="col-span-4 p-3 bg-gray-50 flex justify-center space-x-4">
                  <button onClick={handleModify}>Modifier</button>
                  <button onClick={() => setModify(false)} style={{ background: "#f0f0f0", color: "#333" }}>
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <h6 onClick={() => setModify(true)} className="bleu p-2 cursor-pointer">
                  Bleu
                </h6>
                <h6 onClick={() => setModify(true)} className="vert p-2 cursor-pointer">
                  Vert
                </h6>
                <h6 onClick={() => setModify(true)} className="jaune p-2 cursor-pointer">
                  Jaune
                </h6>
                <h6 onClick={() => setModify(true)} className="rouge p-2 cursor-pointer">
                  Rouge
                </h6>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newColor.bleu}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newColor.vert}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newColor.jaune}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newColor.rouge}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Archétypes:</h4>
        <div className="archetype-container border border-gray-200 rounded-lg overflow-hidden">
          <div className="archetypep grid grid-cols-6 text-center">
            {modify ? (
              <>
                <h6 className="p-2 font-medium">Héro</h6>
                <h6 className="p-2 font-medium">Sage</h6>
                <h6 className="p-2 font-medium">Magicien</h6>
                <h6 className="p-2 font-medium">Explorateur</h6>
                <h6 className="p-2 font-medium">Protecteur</h6>
                <h6 className="p-2 font-medium">Bouffon</h6>
                <input
                  name="hero"
                  value={newArch.hero}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="sage"
                  value={newArch.sage}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="magicien"
                  value={newArch.magicien}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="explorateur"
                  value={newArch.explorateur}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="protecteur"
                  value={newArch.protecteur}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="bouffon"
                  value={newArch.bouffon}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />

                <h6 className="p-2 font-medium">Souverain</h6>
                <h6 className="p-2 font-medium">Créateur</h6>
                <h6 className="p-2 font-medium">Citoyen</h6>
                <h6 className="p-2 font-medium">Amoureuse</h6>
                <h6 className="p-2 font-medium">Rebelle</h6>
                <h6 className="p-2 font-medium">Optimiste</h6>
                <input
                  name="souverain"
                  value={newArch.souverain}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="createur"
                  value={newArch.createur}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="citoyen"
                  value={newArch.citoyen}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="amoureuse"
                  value={newArch.amoureuse}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="rebelle"
                  value={newArch.rebelle}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />
                <input
                  name="optimiste"
                  value={newArch.optimiste}
                  onChange={handleChangeArch}
                  className="p-2 border-t border-gray-200"
                />

                <div className="col-span-6 p-3 bg-gray-50 flex justify-center space-x-4">
                  <button onClick={handleModifyArch}>Modifier</button>
                  <button onClick={() => setModify(false)} style={{ background: "#f0f0f0", color: "#333" }}>
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Héro
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Sage
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Magicien
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Explorateur
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Protecteur
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Bouffon
                </h6>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.hero}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.sage}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.magicien}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.explorateur}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.protecteur}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.bouffon}
                </p>

                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Souverain
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Créateur
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Citoyen
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Amoureuse
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Rebelle
                </h6>
                <h6 onClick={() => setModify(true)} className="p-2 cursor-pointer font-medium">
                  Optimiste
                </h6>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.souverain}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.createur}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.citoyen}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.amoureuse}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.rebelle}
                </p>
                <p onClick={() => setModify(true)} className="p-2 border-t border-gray-200 cursor-pointer">
                  {newArch.optimiste}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Vos deux principaux archétypes:</h4>
        <div className="archetype grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <p className="mb-2 text-center font-medium">{info.archnum1}</p>
            <img
              className="imgSmall !h-[200px] !w-[200px]"
              src={getArchImage(1) || "/placeholder.svg"}
              alt="archétype#1"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2 text-center font-medium">{info.archnum2}</p>
            <img
              className="imgSmall !h-[200px] !w-[200px]"
              src={getArchImage(2) || "/placeholder.svg"}
              alt="archétype#2"
            />
          </div>
        </div>
      </div>

      <div className="texteProfile space-y-6">
        <EditableField label="En bref" name="enbref" value={info.enbref} profileId={info.profileid} />

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

        <h4 className="text-lg font-medium text-gray-800 mt-8 mb-3">Tes archétypes</h4>

        <EditableField
          label="Tes motivations naturelle :"
          name="motivationsnaturelles"
          value={info.motivationsnaturelles}
          profileId={info.profileid}
        />

        <EditableField label="" name="archnum1" value={info.archnum1} profileId={info.profileid} />

        <EditableField label="" name="textarch1" value={info.textarch1} profileId={info.profileid} />

        <EditableField label="" name="archnum2" value={info.archnum2} profileId={info.profileid} />

        <EditableField label="En bref" name="textarch2" value={info.textarch2} profileId={info.profileid} />

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

        <EditableField label="S'adapter au bleu" name="adaptebleu" value={info.adaptebleu} profileId={info.profileid} />

        <EditableField label="S'adapter au vert" name="adaptevert" value={info.adaptevert} profileId={info.profileid} />

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

