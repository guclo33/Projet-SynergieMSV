"use client"

import { useState } from "react"
import { Accordion } from "./Accordion"
import { Modal } from "./Modal"

export function PromptEditor({ prompts, onUpdatePrompt, onAddPrompt, onDeletePrompt }) {
  const [newPromptName, setNewPromptName] = useState("")
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false)

  const handleAddPrompt = () => {
    if (newPromptName.trim()) {
      onAddPrompt(newPromptName.trim())
      setNewPromptName("")
      setIsAddPromptModalOpen(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Prompts ({prompts.length})</h3>

        <button className="btn btn-outline btn-sm" onClick={() => setIsAddPromptModalOpen(true)}>
          + Ajouter un prompt
        </button>
      </div>

      <Accordion
        items={prompts.map((prompt) => ({
          id: prompt.name,
          title: prompt.name,
          content: (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" htmlFor={`prompt-${prompt.name}`}>
                  Contenu du prompt
                </label>
                <button className="btn btn-danger btn-sm" onClick={() => onDeletePrompt(prompt.name)}>
                  Supprimer
                </button>
              </div>
              <textarea
                id={`prompt-${prompt.name}`}
                value={prompt.value}
                onChange={(e) => onUpdatePrompt(prompt.name, e.target.value)}
                placeholder="Entrez le contenu du prompt..."
                className="form-textarea"
              />
            </div>
          ),
        }))}
      />

      {prompts.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "#666" }}>
          Aucun prompt disponible. Ajoutez-en un pour commencer.
        </div>
      )}

      <Modal
        isOpen={isAddPromptModalOpen}
        onClose={() => setIsAddPromptModalOpen(false)}
        title="Ajouter un nouveau prompt"
      >
        <div className="form-group">
          <label className="form-label" htmlFor="new-prompt-name">
            Nom du prompt
          </label>
          <input
            id="new-prompt-name"
            type="text"
            value={newPromptName}
            onChange={(e) => setNewPromptName(e.target.value)}
            placeholder="Entrez un nom..."
            className="form-input"
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setIsAddPromptModalOpen(false)}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleAddPrompt}>
            Ajouter
          </button>
        </div>
      </Modal>
    </div>
  )
}

