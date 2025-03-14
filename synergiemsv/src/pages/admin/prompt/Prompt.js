"use client"

import { useState, useEffect } from "react"
import { PromptEditor } from "./components/PromptEditor"
import { PromptSetManager } from "./components/PromptSetManager"
import { Modal } from "./components/Modal"

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

export function Prompt() {
  const [promptSets, setPromptSets] = useState(samplePromptSets)
  const [selectedSetId, setSelectedSetId] = useState("")
  const [prompts, setPrompts] = useState([])
  const [inputText, setInputText] = useState("")
  const [result, setResult] = useState("")
  const [activeTab, setActiveTab] = useState("edit")
  const [isAddSetModalOpen, setIsAddSetModalOpen] = useState(false)
  const [newSetName, setNewSetName] = useState("")

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

  const handleAddPromptSet = () => {
    if (newSetName.trim()) {
      const newId = String(Date.now())
      setPromptSets([...promptSets, { id: newId, name: newSetName }])
      setNewSetName("")
      setIsAddSetModalOpen(false)
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
    // This would be replaced with actual processing logic
    // For now, just show a sample result
    setResult(`Résultat du traitement pour le texte:\n\n${inputText.substring(0, 100)}...`)
    setActiveTab("result")
  }

  return (
    <div>
      <div className="header-banner">Personnalisation des prompts</div>

      <h2 className="section-title">Gestion des prompts</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <PromptSetManager
            promptSets={promptSets}
            selectedSetId={selectedSetId}
            onSelectSet={setSelectedSetId}
            onDeleteSet={handleDeletePromptSet}
            onOpenAddModal={() => setIsAddSetModalOpen(true)}
          />

          {selectedSetId && (
            <div className="mt-4">
              <button onClick={handleSavePrompts} className="btn btn-primary w-full">
                Sauvegarder tous les prompts
              </button>
            </div>
          )}
        </div>

        <div className="card">
          {selectedSetId ? (
            <div>
              <div className="tabs">
                <div className={`tab ${activeTab === "edit" ? "active" : ""}`} onClick={() => setActiveTab("edit")}>
                  Édition des Prompts
                </div>
                <div className={`tab ${activeTab === "result" ? "active" : ""}`} onClick={() => setActiveTab("result")}>
                  Résultat
                </div>
              </div>

              {activeTab === "edit" && (
                <PromptEditor
                  prompts={prompts}
                  onUpdatePrompt={handleUpdatePrompt}
                  onAddPrompt={handleAddPrompt}
                  onDeletePrompt={handleDeletePrompt}
                />
              )}

              {activeTab === "result" && (
                <div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-text">
                      Texte d'entrée
                    </label>
                    <textarea
                      id="input-text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Entrez le texte à traiter (jusqu'à 1000 mots)..."
                      className="form-textarea"
                    />
                  </div>

                  <button onClick={handleProcessInput} className="btn btn-primary">
                    Traiter le texte
                  </button>

                  {result && (
                    <div className="mt-4">
                      <label className="form-label" htmlFor="result">
                        Résultat
                      </label>
                      <div
                        id="result"
                        className="form-textarea"
                        style={{ backgroundColor: "#f9f9f9", whiteSpace: "pre-wrap" }}
                      >
                        {result}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center" style={{ padding: "2rem 0" }}>
              <p style={{ color: "#666" }}>Veuillez sélectionner ou créer un ensemble de prompts pour commencer.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isAddSetModalOpen} onClose={() => setIsAddSetModalOpen(false)} title="Ajouter un nouvel ensemble">
        <div className="form-group">
          <label className="form-label" htmlFor="new-set-name">
            Nom de l'ensemble
          </label>
          <input
            id="new-set-name"
            type="text"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="Entrez un nom..."
            className="form-input"
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setIsAddSetModalOpen(false)}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleAddPromptSet}>
            Ajouter
          </button>
        </div>
      </Modal>
    </div>
  )
}

