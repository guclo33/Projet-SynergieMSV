"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../../AuthContext"
import { useParams } from "react-router"

export function ProfileWithJSON({ detailsData }) {
  const { info } = detailsData
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const { clientid } = useParams()
  const { archetypeImage } = useContext(AuthContext)
  const apiUrl = process.env.REACT_APP_RENDER_API || "http://localhost:3000"

  // For client-side only
  const [authValue, setAuthValue] = useState(null)
  const [modify, setModify] = useState(false)

  // Parse profilejson if it's a string, otherwise use it directly
  const [profileData, setProfileData] = useState(
    typeof info.profilejson === "string" ? JSON.parse(info.profilejson) : info.profilejson || [],
  )

  // State for color values
  const [colorValues, setColorValues] = useState({
    bleu: info.bleu || 0,
    vert: info.vert || 0,
    jaune: info.jaune || 0,
    rouge: info.rouge || 0,
  })

  // State for archetype values
  const [archetypeValues, setArchetypeValues] = useState({
    hero: info.hero || 0,
    sage: info.sage || 0,
    magicien: info.magicien || 0,
    explorateur: info.explorateur || 0,
    protecteur: info.protecteur || 0,
    bouffon: info.bouffon || 0,
    souverain: info.souverain || 0,
    createur: info.createur || 0,
    citoyen: info.citoyen || 0,
    amoureuse: info.amoureuse || 0,
    rebelle: info.rebelle || 0,
    optimiste: info.optimiste || 0,
  })

  // State for editing section text
  const [editingSectionIndex, setEditingSectionIndex] = useState(null)
  const [editingText, setEditingText] = useState("")

  // State for auth URL
  const [authUrl, setAuthUrl] = useState("")

  // useEffect to get URL params and auth URL on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get clientid from URL path if not available from params
      if (!clientid) {
        const pathParts = window.location.pathname.split("/")
        const possibleClientId = pathParts[pathParts.length - 1]
        if (possibleClientId && possibleClientId !== "admin") {
          // This is just for display, actual clientid should come from useParams
        }
      }

      // Get auth param from query string
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      setAuthValue(urlParams.get("auth"))
    }

    // Fetch auth URL
    const fetchAuthUrl = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/canva/authurl/`, {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setAuthUrl(data.authURL)
      } catch (error) {
        console.error("error fetching authurl", error)
      }
    }

    fetchAuthUrl()
  }, [apiUrl, clientid])

  // Check if profilejson exists and is not empty
  if (!info?.profilejson && profileData.length === 0) {
    return (
      <div className="profile">
        <h3>Il n'y pas de profil json présentement disponible!</h3>
      </div>
    )
  }

  // Sort the sections by order property
  const sortedSections = [...profileData].sort((a, b) => a.order - b.order)

  // Find specific sections by title
  const getBySectionTitle = (title) => {
    const section = profileData.find((section) => section.title === title)
    return section ? section.text : ""
  }

  // Get top two archetypes
  const getTopArchetypes = () => {
    const archetypes = [
      { name: "Hero", value: archetypeValues.hero },
      { name: "Sage", value: archetypeValues.sage },
      { name: "Magicien", value: archetypeValues.magicien },
      { name: "Explorateur", value: archetypeValues.explorateur },
      { name: "Protecteur", value: archetypeValues.protecteur },
      { name: "Bouffon", value: archetypeValues.bouffon },
      { name: "Souverain", value: archetypeValues.souverain },
      { name: "Créateur", value: archetypeValues.createur },
      { name: "Citoyen", value: archetypeValues.citoyen },
      { name: "Amoureuse", value: archetypeValues.amoureuse },
      { name: "Rebelle", value: archetypeValues.rebelle },
      { name: "Optimiste", value: archetypeValues.optimiste },
    ]

    return archetypes.sort((a, b) => b.value - a.value).slice(0, 2)
  }

  // Get archetype image
  const getArchImage = (num) => {
    const topArchs = getTopArchetypes()
    if (num === 1 && topArchs[0]) {
      return archetypeImage ? archetypeImage(topArchs[0].name.toLowerCase()) : ""
    }
    if (num === 2 && topArchs[1]) {
      return archetypeImage ? archetypeImage(topArchs[1].name.toLowerCase()) : ""
    }
    return ""
  }

  // Handle color value change
  const handleChange = (e) => {
    const { name, value } = e.target
    setColorValues((prev) => ({ ...prev, [name]: Number(value) }))
  }

  // Handle archetype value change
  const handleChangeArch = (e) => {
    const { name, value } = e.target
    setArchetypeValues((prev) => ({ ...prev, [name]: Number(value) }))
  }

  // Handle Canva connection
  const handleCanva = async (e) => {
    e.preventDefault()
    if (typeof window !== "undefined" && authUrl) {
      const currentURL = window.location.href
      const authURLWithState = `${authUrl}&state=${encodeURIComponent(currentURL)}`
      window.location.href = authURLWithState
    }
  }

  // Generate Canva template
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
            console.log("successfully autofill Canva")
            if (data && data.editUrl && typeof window !== "undefined") {
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

  // Handle modify colors
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
          value: colorValues,
          profile_id: info.profileid,
        }),
      })

      if (response.ok) {
        console.log("successfully updated profile")
        setModify(false)
      }
    } catch (error) {
      console.log("couldn't modify profile", error)
    }
  }

  // Handle modify archetypes
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
          value: archetypeValues,
          profile_id: info.profileid,
        }),
      })

      if (response.ok) {
        console.log("successfully updated profile")
        setModify(false)
      }
    } catch (error) {
      console.log("couldn't modify profile", error)
    }
  }

  // Start editing a section
  const startEditing = (index, text) => {
    setEditingSectionIndex(index)
    setEditingText(text)
  }

  // Save edited section
  const saveEditing = async (index) => {
    const updatedProfileData = [...profileData]
    updatedProfileData[index] = {
      ...updatedProfileData[index],
      text: editingText,
    }

    // Update local state
    setProfileData(updatedProfileData)

    // Send updated array to server
    try {
      const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/profileJsonUpdate`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profilejson: updatedProfileData,
          profile_id: info.profileid,
        }),
      })

      if (response.ok) {
        console.log("successfully updated profile json")
      } else {
        console.error("Failed to update profile json")
      }
    } catch (error) {
      console.error("Error updating profile json:", error)
    }

    // Reset editing state
    setEditingSectionIndex(null)
    setEditingText("")
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingSectionIndex(null)
    setEditingText("")
  }

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )
  }

  // Get top archetypes for display
  const topArchetypes = getTopArchetypes()

  return (
    <div className="profile">
      {!authValue ? (
        <button onClick={handleCanva}>Connecter Canva</button>
      ) : (
        <button onClick={generateCanva}>Générer template Canva</button>
      )}

      <h2>Profil Synergia :</h2>

      {/* Couleurs Section */}
      <h4>Couleurs:</h4>
      <div className="couleur">
        {modify ? (
          <>
            <h6 className="bleu">Bleu</h6>
            <h6 className="vert">Vert</h6>
            <h6 className="jaune">Jaune</h6>
            <h6 className="rouge">Rouge</h6>
            <input name="bleu" value={colorValues.bleu} onChange={handleChange} />
            <input name="vert" value={colorValues.vert} onChange={handleChange} />
            <input name="jaune" value={colorValues.jaune} onChange={handleChange} />
            <input name="rouge" value={colorValues.rouge} onChange={handleChange} />
            <button onClick={handleModify}>Modifier</button>
            <button onClick={() => setModify(false)}>Annuler</button>
          </>
        ) : (
          <>
            <h6 onClick={() => setModify(true)} className="bleu">
              Bleu
            </h6>
            <h6 onClick={() => setModify(true)} className="vert">
              Vert
            </h6>
            <h6 onClick={() => setModify(true)} className="jaune">
              Jaune
            </h6>
            <h6 onClick={() => setModify(true)} className="rouge">
              Rouge
            </h6>
            <p onClick={() => setModify(true)}>{colorValues.bleu}</p>
            <p onClick={() => setModify(true)}>{colorValues.vert}</p>
            <p onClick={() => setModify(true)}>{colorValues.jaune}</p>
            <p onClick={() => setModify(true)}>{colorValues.rouge}</p>
          </>
        )}
      </div>

      {/* Archetypes Section */}
      <h4>Archetypes:</h4>
      <div className="archetypep">
        {modify ? (
          <>
            <h6>Héro</h6>
            <h6>Sage</h6>
            <h6>Magicien</h6>
            <h6>Explorateur</h6>
            <h6>Protecteur</h6>
            <h6>Bouffon</h6>
            <h6>Souverain</h6>
            <h6>Créateur</h6>
            <h6>Citoyen</h6>
            <h6>Amoureuse</h6>
            <h6>Rebelle</h6>
            <h6>Optimiste</h6>
            <input name="hero" value={archetypeValues.hero} onChange={handleChangeArch} />
            <input name="sage" value={archetypeValues.sage} onChange={handleChangeArch} />
            <input name="magicien" value={archetypeValues.magicien} onChange={handleChangeArch} />
            <input name="explorateur" value={archetypeValues.explorateur} onChange={handleChangeArch} />
            <input name="protecteur" value={archetypeValues.protecteur} onChange={handleChangeArch} />
            <input name="bouffon" value={archetypeValues.bouffon} onChange={handleChangeArch} />
            <input name="souverain" value={archetypeValues.souverain} onChange={handleChangeArch} />
            <input name="createur" value={archetypeValues.createur} onChange={handleChangeArch} />
            <input name="citoyen" value={archetypeValues.citoyen} onChange={handleChangeArch} />
            <input name="amoureuse" value={archetypeValues.amoureuse} onChange={handleChangeArch} />
            <input name="rebelle" value={archetypeValues.rebelle} onChange={handleChangeArch} />
            <input name="optimiste" value={archetypeValues.optimiste} onChange={handleChangeArch} />
            <button onClick={handleModifyArch}>Modifier</button>
            <button onClick={() => setModify(false)}>Annuler</button>
          </>
        ) : (
          <>
            <h6 onClick={() => setModify(true)}>Hero</h6>
            <h6 onClick={() => setModify(true)}>Sage</h6>
            <h6 onClick={() => setModify(true)}>Magicien</h6>
            <h6 onClick={() => setModify(true)}>Explorateur</h6>
            <h6 onClick={() => setModify(true)}>Protecteur</h6>
            <h6 onClick={() => setModify(true)}>Bouffon</h6>
            <h6 onClick={() => setModify(true)}>Souverain</h6>
            <h6 onClick={() => setModify(true)}>Créateur</h6>
            <h6 onClick={() => setModify(true)}>Citoyen</h6>
            <h6 onClick={() => setModify(true)}>Amoureuse</h6>
            <h6 onClick={() => setModify(true)}>Rebelle</h6>
            <h6 onClick={() => setModify(true)}>Optimiste</h6>
            <p onClick={() => setModify(true)}>{archetypeValues.hero}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.sage}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.magicien}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.explorateur}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.protecteur}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.bouffon}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.souverain}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.createur}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.citoyen}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.amoureuse}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.rebelle}</p>
            <p onClick={() => setModify(true)}>{archetypeValues.optimiste}</p>
          </>
        )}
      </div>

      {/* Top Archetypes Section */}
      <h4>Vos deux principaux archétypes:</h4>
      <div className="archetype">
        {topArchetypes.length > 0 && (
          <>
            <p>{topArchetypes[0]?.name}</p>
            <p>{topArchetypes[1]?.name}</p>
            <img
              className="imgSmall !h-[200px] !w-[200px]"
              src={getArchImage(1) || "/placeholder.svg"}
              alt="archétype#1"
            />
            <img
              className="imgSmall !h-[200px] !w-[200px]"
              src={getArchImage(2) || "/placeholder.svg"}
              alt="archétype#2"
            />
          </>
        )}
      </div>

      {/* Profile Text Sections - Dynamically mapped from profileData */}
      <div className="texteProfile">
        {sortedSections.map((section, index) => (
          <div key={index} className="section">
            {section.title !== "arch1_nom" && section.title !== "arch2_prompt" && (
              <h5>{section.title.replace(/_text$/, "").replace(/_/g, " ")}</h5>
            )}

            {editingSectionIndex === index ? (
              <div className="editableField">
                <textarea
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full min-h-[100px]"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => saveEditing(index)}>Enregistrer</button>
                  <button onClick={cancelEditing}>Annuler</button>
                </div>
              </div>
            ) : (
              <div
                className="text-content"
                onClick={() => startEditing(index, section.text)}
                dangerouslySetInnerHTML={{ __html: section.text.replace(/\n/g, "<br>") }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

