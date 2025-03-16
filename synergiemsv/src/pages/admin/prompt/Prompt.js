"use client"

import { useState, useEffect } from "react"
import { PromptSetSelector } from "./components/PromptSetManager"
import { PromptEditor } from "./components/PromptEditor"
import { ResponseViewer } from "./components/ResponseViewer"

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

  // Sample data - replace with actual API calls
  const samplePromptSets = [
    { id: "1", name: "Set Standard" },
    { id: "2", name: "Set Entreprise" },
  ]

  const [promptSets, setPromptSets] = useState(samplePromptSets)
  const [selectedSetId, setSelectedSetId] = useState("1") // Default to first set
  const [prompts, setPrompts] = useState([])
  const [inputText, setInputText] = useState("")
  const [responses, setResponses] = useState([])

  // Load prompts when a set is selected
  useEffect(() => {
    if (selectedSetId) {
      // In a real app, fetch from API
      // For now, generate sample prompts based on the default names
      const samplePrompts = defaultPromptNames.map((name) => ({
        name,
        value: `Sample prompt for ${name}`,
      }))
      setPrompts(samplePrompts)
    } else {
      setPrompts([])
    }
  }, [selectedSetId])

  const handleAddPromptSet = (name) => {
    if (name.trim()) {
      const newId = String(Date.now())
      setPromptSets([...promptSets, { id: newId, name }])
      setSelectedSetId(newId)
    }
  }

  const handleDeletePromptSet = (id) => {
    setPromptSets(promptSets.filter((set) => set.id !== id))
    if (selectedSetId === id) {
      setSelectedSetId("")
      setPrompts([])
    }
  }

  const handleUpdatePrompt = (name, value) => {
    setPrompts(prompts.map((prompt) => (prompt.name === name ? { ...prompt, value } : prompt)))
  }

  const handleAddPrompt = (name) => {
    if (name && !prompts.some((p) => p.name === name)) {
      setPrompts([...prompts, { name, value: "" }])
    }
  }

  const handleDeletePrompt = (name) => {
    setPrompts(prompts.filter((prompt) => prompt.name !== name))
  }

  const handleSavePrompts = async () => {
    if (!selectedSetId) return

    // In a real app, send to API
    const selectedSet = promptSets.find((set) => set.id === selectedSetId)

    console.log(
      "Saving prompts:",
      prompts.map((prompt) => ({
        id: `${selectedSetId}-${prompt.name}`,
        prompt_set_id: selectedSetId,
        prompt_set_name: selectedSet?.name,
        prompt_name: prompt.name,
        value: prompt.value,
      })),
    )

    // Simulate successful save
    alert("Prompts sauvegardés avec succès!")
  }

  const handleProcessInput = () => {
    if (!inputText.trim() || prompts.length === 0) return

    // Simulate processing with each prompt
    const newResponses = prompts.slice(0, 3).map((prompt) => ({
      promptName: prompt.name,
      timestamp: new Date().toLocaleTimeString(),
      content: `Réponse générée pour "${prompt.name}": ${inputText.substring(0, 50)}...`,
    }))

    setResponses(newResponses)
  }

  const selectedSet = promptSets.find((set) => set.id === selectedSetId)

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
            onSelectSet={setSelectedSetId}
            onAddSet={handleAddPromptSet}
            onDeleteSet={handleDeletePromptSet}
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
                onSaveAll={handleSavePrompts}
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

