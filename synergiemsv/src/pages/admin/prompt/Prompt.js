"use client"

import { useState, useEffect, useContext } from "react"
import { PromptSetSelector } from "./components/PromptSetManager"
import { PromptEditor } from "./components/PromptEditor"
import { ResponseViewer } from "./components/ResponseViewer"
import { AuthContext } from "../../AuthContext"
import { getPromptSets, getPrompts, createPrompts, updatePrompt } from "./actions/prompt.action"

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
  const {userId} = useContext(AuthContext)// Replace with actual user ID from auth

  // Load prompt sets on component mount
  useEffect(() => {
    const loadPromptSets = async () => {
      setLoading(true)
      try {
        const sets = await getPromptSets(userId)
        if (sets && sets.length > 0) {
          setPromptSets(sets)
          // Don't auto-select the first set anymore
        }
      } catch (error) {
        console.error("Error loading prompt sets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPromptSets()
  }, [userId])

  // Load prompts when a set is selected
  useEffect(() => {
    const loadPrompts = async () => {
      if (!selectedSetName) {
        setPrompts([])
        return
      }

      setLoading(true)
      try {
        const promptsData = await getPrompts(userId, selectedSetName)
        if (promptsData && promptsData.length > 0) {
          setPrompts(
            promptsData.map((p) => ({
              prompt_set_id: p.prompt_set_id,
              prompt_number: p.prompt_number,
              prompt_set_name: p.prompt_set_name,
              prompt_name: p.prompt_name,
              value: p.value,
            })),
          )
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
          } else {
            setPrompts([])
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
        }
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [userId, selectedSetId, selectedSetName])

  const getNextSetId = () => {
    // If no prompt sets exist, start with 1
    if (promptSets.length === 0) {
      return "1"
    }

    // Find the highest numeric ID
    const highestId = promptSets.reduce((max, set) => {
      const id = Number.parseInt(set.id, 10)
      return isNaN(id) ? max : Math.max(max, id)
    }, 0)

    // Return the next ID as a string
    return String(highestId + 1)
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
            value: "",
          },
        ]

        // Save to server first
        const result = await createPrompts(userId, name, initialPrompts)

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

  const handleSelectSet = (id) => {
    if (id === "") {
      // Clear selection
      setSelectedSetId("")
      setSelectedSetName("")
      setPrompts([])
      return
    }

    const set = promptSets.find((s) => s.id === id)
    if (set) {
      setSelectedSetId(id)
      setSelectedSetName(set.name)
    }
  }

  const handleUpdatePrompt = (name, value) => {
    setPrompts(prompts.map((prompt) => (prompt.prompt_name === name ? { ...prompt, value } : prompt)))
  }

  const handleSavePrompt = async (promptName) => {
    if (!selectedSetName) return

    const promptToSave = prompts.find((p) => p.prompt_name === promptName)
    if (!promptToSave) return

    setLoading(true)
    try {
      await updatePrompt(userId, selectedSetName, promptToSave)
      // Show success message or notification
      alert(`Prompt "${promptName}" sauvegardé avec succès!`)
    } catch (error) {
      console.error("Error saving prompt:", error)
      alert("Erreur lors de la sauvegarde du prompt.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPrompt = async (name) => {
    if (name && !prompts.some((p) => p.prompt_name === name)) {
      const newPrompt = {
        prompt_set_id: selectedSetId,
        prompt_number: prompts.length + 1,
        prompt_set_name: selectedSetName,
        prompt_name: name,
        value: "",
      }

      // Add to local state first for immediate feedback
      setPrompts((prev) => [...prev, newPrompt])

      // Then save to server
      try {
        setLoading(true)
        await createPrompts(userId, selectedSetName, [...prompts, newPrompt])
      } catch (error) {
        console.error("Error adding prompt:", error)
        // Revert on error
        setPrompts(prompts)
        alert("Erreur lors de l'ajout du prompt.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeletePrompt = async (name) => {
    // Don't allow deleting the system prompt if it's the only one
    if (name === "system" && prompts.length === 1) {
      alert("Vous ne pouvez pas supprimer le prompt système s'il est le seul prompt.")
      return
    }

    const updatedPrompts = prompts.filter((prompt) => prompt.prompt_name !== name)

    // Update local state first for immediate feedback
    setPrompts(updatedPrompts)

    // Then save to server
    try {
      setLoading(true)
      await createPrompts(userId, selectedSetName, updatedPrompts)
    } catch (error) {
      console.error("Error deleting prompt:", error)
      // Revert on error
      setPrompts(prompts)
      alert("Erreur lors de la suppression du prompt.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAllPrompts = async () => {
    if (!selectedSetName) return

    setLoading(true)
    try {
      await createPrompts(userId, selectedSetName, prompts)
      alert("Tous les prompts ont été sauvegardés avec succès!")
    } catch (error) {
      console.error("Error saving all prompts:", error)
      alert("Erreur lors de la sauvegarde des prompts.")
    } finally {
      setLoading(false)
    }
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
                loading={loading}
              />
            </div>
            <div>
              <ResponseViewer
                inputText={inputText}
                setInputText={setInputText}
                responses={responses}
                onProcessInput={handleProcessInput}
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

