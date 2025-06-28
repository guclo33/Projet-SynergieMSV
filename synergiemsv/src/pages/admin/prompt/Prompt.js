"use client"

import { useState, useEffect, useContext } from "react"
import { PromptSetSelector } from "./components/PromptSetManager"
import { PromptEditor } from "./components/PromptEditor"
import { ResponseViewer } from "./components/ResponseViewer"
import { AuthContext } from "../../AuthContext"
import { AdminContext} from "../AdminContext"
import {
  getPromptSetsAPI,
  getPromptsAPI,
  createPromptsAPI,
  updatePromptAPI,
  deletePromptAPI,
  updateAllPromptsAPI,
} from "./actions/prompt.action"

export function Prompt() {
  // Default prompt names
  const defaultPromptNames = [
    "system",
    "assistant",
    "assistant2",
    "en_bref",
    "forces",
    "defis",
    "changement",
    "interpersonnelles",
    "structure",
    "problemes",
    "archetype",
    "description_archetype1",
    "description_archetype2",
    "archetype1",
    "archetype2",
    "travail",
    "adapte_rouge",
    "adapte_bleu",
    "adapte_vert",
    "adapte_jaune",
  ]

  const [promptSets, setPromptSets] = useState([])
  const [selectedSetId, setSelectedSetId] = useState("")
  const [selectedSetName, setSelectedSetName] = useState("")
  const [prompts, setPrompts] = useState([])
  const [inputText, setInputText] = useState("")
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const { clientsData} = useContext(AdminContext)
  // Add a new state for the selected prompt
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  // Add a new state to track original prompt values from the database
  const [originalPromptValues, setOriginalPromptValues] = useState({})

  // Load prompt sets on component mount
  useEffect(() => {
    const loadPromptSets = async () => {
      setLoading(true)
      try {
        const sets = await getPromptSetsAPI(user.id)

        if (sets && sets.length > 0) {
          // Assurez-vous que chaque ensemble a un id en string
          const formattedSets = sets.map((set) => ({
            ...set,
            id: set.id,
          }))
          setPromptSets(formattedSets)

        }
      } catch (error) {
        console.error("Error loading prompt sets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPromptSets()
  }, [user.id])

  // Load prompts when a set is selected
  useEffect(() => {
    const loadPrompts = async () => {
      if (!selectedSetName) {
        setPrompts([])
        return
      }

      setLoading(true)
      try {
        const promptsData = await getPromptsAPI(user.id, selectedSetName)
        if (promptsData && promptsData.length > 0) {
          const loadedPrompts = promptsData.map((p) => ({
            prompt_set_id: p.prompt_set_id,
            prompt_number: p.prompt_number,
            prompt_set_name: p.prompt_set_name,
            prompt_name: p.prompt_name,
            value: p.value,
          }))

          setPrompts(loadedPrompts)

          // Store original values in a separate state for comparison
          const originalValues = {}
          loadedPrompts.forEach((prompt) => {
            originalValues[prompt.prompt_name] = prompt.value
          })
          setOriginalPromptValues(originalValues)


        } else {
          // If no prompts are returned, create a default system prompt
          if (selectedSetId) {
            const defaultSystemPrompt = {
              prompt_set_id: selectedSetId,
              prompt_number: 1,
              prompt_set_name: selectedSetName,
              prompt_name: "system",
              value: "",
            }
            setPrompts([defaultSystemPrompt])
            setOriginalPromptValues({ system: "" })
          } else {
            setPrompts([])
            setOriginalPromptValues({})
          }
        }
      } catch (error) {
        console.error("Error loading prompts:", error)
        // Set default system prompt on error too
        if (selectedSetId) {
          const defaultSystemPrompt = {
            prompt_set_id: selectedSetId,
            prompt_number: 1,
            prompt_set_name: selectedSetName,
            prompt_name: "system",
            value: "",
          }
          setPrompts([defaultSystemPrompt])
          setOriginalPromptValues({ system: "" })
        }
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [user.id, selectedSetId, selectedSetName])

  const getNextSetId = () => {
    // If no prompt sets exist, start with 1
    if (promptSets.length === 0) {
      return 1
    }

    // Find the highest numeric ID
    const highestId = promptSets.reduce((max, set) => {
      const id = Number.parseInt(set.id, 10)
      return isNaN(id) ? max : Math.max(max, id)
    }, 0)

    // Return the next ID as a string
    return highestId + 1
  }

  const handleAddPromptSet = async (name) => {
    if (name.trim()) {
      setLoading(true)

      try {
        // Create a new prompt set with a system prompt as the first one
        const newSetId = getNextSetId()
        const newSet = { id: newSetId, name }

        // Create initial system prompt
        const initialPrompts = [
          {
            prompt_set_id: newSetId,
            prompt_number: 1,
            prompt_set_name: name,
            prompt_name: "system",
            value: "Définissez un contexte pour la conversation...",
          },
        ]

        // Save to server first
        const result = await createPromptsAPI(user.id, name, initialPrompts)

        if (result) {
          // Add to local state after successful server save
          setPromptSets((prev) => [...prev, newSet])
          setSelectedSetId(newSetId)
          setSelectedSetName(name)
          setPrompts(initialPrompts) // Set the prompts immediately
        }
      } catch (error) {
        console.error("Error creating prompt set:", error)
        alert("Erreur lors de la création de l'ensemble de prompts.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Modifiez la fonction handleSelectSet pour ajouter des logs et assurer la conversion de type
  const handleSelectSet = (id) => {



    if (id === "") {
      // Clear selection
      setSelectedSetId("")
      setSelectedSetName("")
      setPrompts([])
      return
    }

    // Convert id to string to ensure consistent comparison
    const stringId = String(id)
    const set = promptSets.find((s) => String(s.id) === stringId)



    if (set) {
      setSelectedSetId(stringId)
      // Use set.prompt_set_name if it exists, otherwise fallback to set.name
      setSelectedSetName(set.prompt_set_name || set.name || "")
    } else {
      console.error("Set not found with ID:", id)
    }
  }

  // Modify handleUpdatePrompt to compare with original values
  const handleUpdatePrompt = (name, value) => {
    // Check if the current value is different from the original value
    const isModified = value !== originalPromptValues[name]

    // Update the prompts array with the new value
    setPrompts(prompts.map((prompt) => (prompt.prompt_name === name ? { ...prompt, value } : prompt)))

    // Only mark as edited if the value is different from the original
    if (isModified) {
      setPrompts(prompts.map((prompt) => (prompt.prompt_name === name ? { ...prompt, value } : prompt)))
    }
  }

  // Update handleSavePrompt to update the original values after saving
  const handleSavePrompt = async (promptName) => {
    if (!selectedSetName) return

    const promptToSave = prompts.find((p) => p.prompt_name === promptName)
    if (!promptToSave) return

    setLoading(true)
    try {
      // Get the current index of this prompt
      const promptIndex = prompts.findIndex((p) => p.prompt_name === promptName)

      // Update only this specific prompt with its position number
      // Ensure prompt_set_id matches the selectedSetId (as a number)
      const updatedPrompt = {
        ...promptToSave,
        prompt_set_id: Number(selectedSetId), // Convert to number to ensure consistency
        prompt_number: promptIndex + 1,
      }

      // Save to server (individual prompt update)
      const response = await updatePromptAPI(user.id, selectedSetName, updatedPrompt)

        if (response) {
      // Update all prompts to ensure prompt_number is consistent
            const updatedPrompts = prompts.map((p, idx) => {
                if (p.prompt_name === promptName) {
                return updatedPrompt
                }
                return {
                ...p,
                prompt_number: idx + 1,
                }
            })

            // Update state with all updated prompts
            setPrompts(updatedPrompts)

            // Update the original value after successful save
            setOriginalPromptValues((prev) => ({
                ...prev,
                [promptName]: promptToSave.value,
            }))

            alert(`Prompt "${promptName}" sauvegardé avec succès!`)

        } else {
      alert("Erreur lors de la sauvegarde du prompt.")
    }

    } catch (error) {
      console.error("Error saving prompt:", error)
      alert("Erreur lors de la sauvegarde du prompt.")
    } finally {
      setLoading(false)
    }
  }

  // Update handleSaveAllPrompts to update all original values after saving
  const handleSaveAllPrompts = async () => {
    if (!selectedSetName) return

    setLoading(true)
    try {
      // Mettre à jour tous les prompt_number en fonction de l'index du tableau
      // S'assurer également que tous les prompts ont le bon prompt_set_id
      const updatedPrompts = prompts.map((prompt, index) => ({
        ...prompt,
        prompt_set_id: Number(selectedSetId), // Convertir en nombre pour assurer la cohérence
        prompt_number: index + 1,
      }))



      // Sauvegarder tous les prompts sur le serveur avec les valeurs prompt_number mises à jour
      const response = await updateAllPromptsAPI(user.id, selectedSetName, updatedPrompts)

      if (response.message === "Success!") {
        alert("Tous les prompts ont été sauvegardés avec succès")
        setPrompts(updatedPrompts)

        // Update all original values after successful save
        const newOriginalValues = {}
        updatedPrompts.forEach((prompt) => {
          newOriginalValues[prompt.prompt_name] = prompt.value
        })
        setOriginalPromptValues(newOriginalValues)
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des prompts:", error)
      alert("Erreur lors de la sauvegarde des prompts.")
    } finally {
      setLoading(false)
    }
  }

  // Update handleAddPrompt to add the new prompt to originalPromptValues
  const handleAddPrompt = async (name) => {
    if (name && !prompts.some((p) => p.prompt_name === name)) {
      const newPrompt = {
        prompt_set_id: Number(selectedSetId), // Convert to number to ensure consistency
        prompt_number: prompts.length + 1,
        prompt_set_name: selectedSetName,
        prompt_name: name,
        value: "",
      }

      // Add to local state first for immediate feedback
      setPrompts((prev) => [...prev, newPrompt])

      // Add to original values
      setOriginalPromptValues((prev) => ({
        ...prev,
        [name]: "",
      }))

      // Then save to server
      try {
        setLoading(true)
        await createPromptsAPI(user.id, selectedSetName, [...prompts, newPrompt])
      } catch (error) {
        console.error("Error adding prompt:", error)
        // Revert on error
        setPrompts(prompts)

        // Remove from original values
        setOriginalPromptValues((prev) => {
          const newValues = { ...prev }
          delete newValues[name]
          return newValues
        })

        alert("Erreur lors de l'ajout du prompt.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Update handleDeletePrompt to remove the prompt from originalPromptValues
  const handleDeletePrompt = async (name) => {
    // Don't allow deleting the system prompt if it's the only one
    if (name === "system" && prompts.length === 1) {
      alert("Vous ne pouvez pas supprimer le prompt système s'il est le seul prompt.")
      return
    }

    const updatedPrompts = prompts.filter((prompt) => prompt.prompt_name !== name)

    const promptToDelete = prompts.find((p) => p.prompt_name === name)

    // Update local state first for immediate feedback
    setPrompts(updatedPrompts)

    // Remove from original values
    setOriginalPromptValues((prev) => {
      const newValues = { ...prev }
      delete newValues[name]
      return newValues
    })

    // Then save to server
    try {
      setLoading(true)

      const response = await deletePromptAPI(user.id, selectedSetName, promptToDelete.prompt_name)
      if (response.ok) {
        // Update local state first for immediate feedback
        setPrompts(updatedPrompts)
        alert(`Prompt "${promptToDelete.prompt_name}" supprimé avec succès!`)
      } else {
        alert("Erreur lors de la suppression du prompt.")
      }
    } catch (error) {
      console.error("Error deleting prompt:", error)
      // Revert on error
      setPrompts(prompts)

      // Restore original value
      setOriginalPromptValues((prev) => ({
        ...prev,
        [name]: promptToDelete.value,
      }))

      alert("Erreur lors de la suppression du prompt.")
    } finally {
      setLoading(false)
    }
  }

  // Update handleUpdatePromptName to update the key in originalPromptValues
  const handleUpdatePromptName = async (oldName, newName) => {
    if (!selectedSetName || !newName.trim() || oldName === newName) return

    // Don't allow renaming the system prompt
    if (oldName === "system") {
      alert("Vous ne pouvez pas renommer le prompt système.")
      return
    }

    setLoading(true)
    try {
      // Find the prompt to update
      const promptToUpdate = prompts.find((p) => p.prompt_name === oldName)
      if (!promptToUpdate) return

      // Create updated prompt with new name
      const updatedPrompt = {
        ...promptToUpdate,
        prompt_name: newName,
      }

      // Update on server
      // Note: You may need to adjust your API to handle renaming
      await updatePromptAPI(user.id, selectedSetName, updatedPrompt)

      // Update in local state
      setPrompts(prompts.map((p) => (p.prompt_name === oldName ? { ...p, prompt_name: newName } : p)))

      // Update key in original values
      setOriginalPromptValues((prev) => {
        const newValues = { ...prev }
        newValues[newName] = newValues[oldName]
        delete newValues[oldName]
        return newValues
      })

      alert(`Prompt "${oldName}" renommé en "${newName}" avec succès!`)
    } catch (error) {
      console.error("Error updating prompt name:", error)
      alert("Erreur lors du renommage du prompt.")
    } finally {
      setLoading(false)
    }
  }

  // New function to reorder prompts
  const handleReorderPrompt = (oldIndex, newIndex) => {
    // Créer une copie du tableau des prompts
    const reorderedPrompts = [...prompts]

    // Retirer le prompt de son ancienne position
    const [movedPrompt] = reorderedPrompts.splice(oldIndex, 1)

    // Insérer le prompt à sa nouvelle position
    reorderedPrompts.splice(newIndex, 0, movedPrompt)

    // Mettre à jour le prompt_number pour tous les prompts
    const updatedPrompts = reorderedPrompts.map((prompt, index) => ({
      ...prompt,
      prompt_number: index + 1,
    }))

    // Mettre à jour l'état avec les prompts réordonnés
    setPrompts(updatedPrompts)

    // Ne pas sauvegarder automatiquement - l'utilisateur devra cliquer sur "Sauvegarder tous les prompts"

  }

  const handleProcessInput = () => {
    if (!inputText.trim() || prompts.length === 0) return

    // Simulate processing with each prompt
    const newResponses = prompts.slice(0, 3).map((prompt) => ({
      promptName: prompt.prompt_name,
      timestamp: new Date().toLocaleTimeString(),
      content: `Réponse générée pour "${prompt.prompt_name}": ${inputText.substring(0, 50)}...`,
    }))

    setResponses(newResponses)
  }


  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Personnalisation des prompts</h1>
        <div className="h-px bg-gray-200 w-full"></div>
      </header>

      <main>
        <h2 className="text-2xl font-semibold mb-4">Gestion des prompts</h2>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <PromptSetSelector
            promptSets={promptSets}
            selectedSetId={selectedSetId}
            onSelectSet={handleSelectSet}
            onAddSet={handleAddPromptSet}
            onDeleteSet={() => {}} // Removed delete functionality
            loading={loading}
          />
        </div>

        {selectedSetId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PromptEditor
                prompts={prompts}
                onUpdatePrompt={handleUpdatePrompt}
                onAddPrompt={handleAddPrompt}
                onDeletePrompt={handleDeletePrompt}
                onSaveAll={handleSaveAllPrompts}
                onSavePrompt={handleSavePrompt}
                onUpdatePromptName={handleUpdatePromptName}
                onReorderPrompt={handleReorderPrompt}
                loading={loading}
              />
            </div>
            <div>
              <ResponseViewer
                inputText={inputText}
                setInputText={setInputText}
                responses={responses}
                onProcessInput={handleProcessInput}
                selectedSetId={selectedSetId}
                prompts={prompts}
                clientsData={clientsData}
                user={user}
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p>Veuillez sélectionner ou créer un ensemble de prompts pour commencer.</p>
          </div>
        )}
      </main>
    </div>
  )
}

