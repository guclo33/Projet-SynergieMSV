"use client"

import { useState, useEffect, useRef } from "react"
import { openAiExecuteAPI } from "../actions/prompt.action"
import { ChevronDown } from "lucide-react"

export function ResponseViewer({
  inputText,
  setInputText,
  responses,
  onProcessInput,
  prompts,
  clientsData,
  selectedSetId,
  user,
}) {
  const [selectedFormId, setSelectedFormId] = useState("")
  const [selectedPromptName, setSelectedPromptName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [clientSearchTerm, setClientSearchTerm] = useState("")
  const [promptSearchTerm, setPromptSearchTerm] = useState("")
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false)
  const [isPromptSelectOpen, setIsPromptSelectOpen] = useState(false)
  const clientSelectRef = useRef(null)
  const promptSelectRef = useRef(null)

  // Filter out the system prompt
  const availablePrompts = prompts?.filter((prompt) => prompt.prompt_name !== "system") || []

  // Create a flattened list of client-form options
  // Filter for active clients and valid form_ids
  const clientFormOptions = []
  const uniqueClientFormPairs = new Set() // To track unique client-form pairs

  clientsData?.forEach((client) => {
    if (client.active && client.form_ids && client.form_ids.length > 0) {
      client.form_ids.forEach((formId) => {
        if (formId !== null) {
          // Create a unique key for this client-form pair
          const pairKey = `${client.id}-${formId}`

          // Only add if this pair hasn't been added before
          if (!uniqueClientFormPairs.has(pairKey)) {
            uniqueClientFormPairs.add(pairKey)

            clientFormOptions.push({
              clientId: client.id,
              clientName: client.nom,
              formId: formId,
              displayText: `${client.nom} - formId : ${formId}`,
            })
          }
        }
      })
    }
  })

  // Sort options alphabetically by client name
  clientFormOptions.sort((a, b) => a.clientName.localeCompare(b.clientName))

  // Filter client options based on search term
  const filteredClientOptions = clientSearchTerm
    ? clientFormOptions.filter((option) => option.displayText.toLowerCase().includes(clientSearchTerm.toLowerCase()))
    : clientFormOptions

  // Filter prompt options based on search term
  const filteredPromptOptions = promptSearchTerm
    ? availablePrompts.filter((prompt) => prompt.prompt_name.toLowerCase().includes(promptSearchTerm.toLowerCase()))
    : availablePrompts

  // Close the client select dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (clientSelectRef.current && !clientSelectRef.current.contains(event.target)) {
        setIsClientSelectOpen(false)
      }
      if (promptSelectRef.current && !promptSelectRef.current.contains(event.target)) {
        setIsPromptSelectOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClientOptionSelect = (formId) => {
    setSelectedFormId(formId)
    setIsClientSelectOpen(false)
  }

  const handlePromptOptionSelect = (promptName) => {
    setSelectedPromptName(promptName)
    setIsPromptSelectOpen(false)
  }

  const handleProcessWithAPI = async () => {
    if (!selectedFormId || !selectedPromptName) {
      alert("Veuillez sélectionner un formulaire et un prompt.")
      return
    }

    setIsLoading(true)
    try {
      const result = await openAiExecuteAPI(user.id, selectedFormId, selectedPromptName, selectedSetId)

      if(result) {
        // Add the new response to the existing responses
        console.log("API response:", result)
      const newResponse = {
        promptName: selectedPromptName,
        timestamp: new Date().toLocaleTimeString(),
        content: result.content || result.text || "Aucune réponse reçue",
        formId: selectedFormId,
      }

      // Update responses
       onProcessInput([newResponse, ...responses])
      }
      
    } catch (error) {
      console.error("Erreur lors de l'exécution de l'API:", error)
      alert("Une erreur s'est produite lors du traitement de votre demande.")
    } finally {
      setIsLoading(false)
    }
  }

  // Find the selected client option display text
  const selectedClientOption = clientFormOptions.find(
    (option) => option.formId.toString() === selectedFormId?.toString(),
  )

  // Find the selected prompt
  const selectedPrompt = availablePrompts.find((prompt) => prompt.prompt_name === selectedPromptName)

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-medium text-purple-800 mb-4">Réponses Générées</h3>

      <div className="mb-6 space-y-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Client et Formulaire</div>
          <div className="relative" ref={clientSelectRef}>
            <div
              className="w-full border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
              onClick={() => setIsClientSelectOpen(!isClientSelectOpen)}
            >
              <span className={selectedClientOption ? "text-black" : "text-gray-500"}>
                {selectedClientOption ? selectedClientOption.displayText : "Sélectionner un client et formulaire"}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${isClientSelectOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isClientSelectOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={clientSearchTerm}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {filteredClientOptions.length > 0 ? (
                  filteredClientOptions.map((option) => (
                    <div
                      key={`${option.clientId}-${option.formId}`}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        selectedFormId === option.formId.toString() ? "bg-purple-100" : ""
                      }`}
                      onClick={() => handleClientOptionSelect(option.formId.toString())}
                    >
                      {option.displayText}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Aucun résultat trouvé</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Prompt</div>
          <div className="relative" ref={promptSelectRef}>
            <div
              className="w-full border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
              onClick={() => setIsPromptSelectOpen(!isPromptSelectOpen)}
            >
              <span className={selectedPromptName ? "text-black" : "text-gray-500"}>
                {selectedPromptName || "Sélectionner un prompt"}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${isPromptSelectOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isPromptSelectOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={promptSearchTerm}
                    onChange={(e) => setPromptSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {filteredPromptOptions.length > 0 ? (
                  filteredPromptOptions.map((prompt) => (
                    <div
                      key={prompt.prompt_name}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        selectedPromptName === prompt.prompt_name ? "bg-purple-100" : ""
                      }`}
                      onClick={() => handlePromptOptionSelect(prompt.prompt_name)}
                    >
                      {prompt.prompt_name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Aucun résultat trouvé</div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleProcessWithAPI}
          disabled={isLoading || !selectedFormId || !selectedPromptName}
          className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400 flex items-center justify-center"
          style={{
            background: "linear-gradient(to right, #7e3b92, #a03a94)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Traitement en cours...
            </>
          ) : (
            "Traiter le texte"
          )}
        </button>
      </div>

      {responses.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {responses.map((response, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                  <span className="font-medium text-purple-700">{response.promptName}</span>
                  {response.formId && <span className="text-xs text-gray-600">Formulaire: {response.formId}</span>}
                </div>
                <span className="text-xs text-gray-500">{response.timestamp}</span>
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">{response.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
          <p>
            Aucune réponse générée. Sélectionnez un client, un formulaire et un prompt, puis cliquez sur "Traiter le
            texte" pour voir les résultats.
          </p>
        </div>
      )}
    </div>
  )
}

