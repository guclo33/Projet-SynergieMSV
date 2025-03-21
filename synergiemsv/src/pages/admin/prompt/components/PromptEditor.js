"use client"

import { useState } from "react"
import { PlusCircle, Save, Trash2 } from "lucide-react"

export function PromptEditor({
  prompts,
  onUpdatePrompt,
  onAddPrompt,
  onDeletePrompt,
  onSaveAll,
  onSavePrompt,
  loading,
}) {
  const [newPromptName, setNewPromptName] = useState("")
  const [editedPrompts, setEditedPrompts] = useState({})

  const handleAddPrompt = () => {
    if (newPromptName.trim() && !prompts.some((p) => p.prompt_name === newPromptName)) {
      onAddPrompt(newPromptName)
      setNewPromptName("")
    }
  }

  const handlePromptChange = (name, value) => {
    // Mark this prompt as edited
    setEditedPrompts((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Update the prompt value
    onUpdatePrompt(name, value)
  }

  const handleSavePrompt = (name) => {
    onSavePrompt(name)
    // Clear the edited flag after saving
    setEditedPrompts((prev) => ({
      ...prev,
      [name]: false,
    }))
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-purple-800">Édition des Prompts ({prompts.length})</h3>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newPromptName}
          onChange={(e) => setNewPromptName(e.target.value)}
          placeholder="Nom du nouveau prompt..."
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleAddPrompt}
          disabled={loading}
          className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap disabled:bg-purple-400 flex items-center gap-1"
        >
          <PlusCircle size={16} />
          <span>Ajouter un prompt</span>
        </button>
      </div>

      {prompts.length === 0 && !loading ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Aucun prompt dans cet ensemble. Ajoutez-en un pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {prompts.map((prompt, index) => (
            <div
              id={index}
              key={prompt.prompt_name}
              className={`p-4 rounded-lg border ${
                editedPrompts[prompt.prompt_name] ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="font-medium text-lg mb-2 text-purple-700 flex items-center">
                {prompt.prompt_name}
                {prompt.prompt_name === "system" && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Obligatoire</span>
                )}
                {editedPrompts[prompt.prompt_name] && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modifié</span>
                )}
              </div>
              <div className="mb-2">
                <div className="text-sm text-gray-600 mb-1">Contenu du prompt</div>
                <textarea
                  value={prompt.value}
                  onChange={(e) => handlePromptChange(prompt.prompt_name, e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleSavePrompt(prompt.prompt_name)}
                  disabled={loading || !editedPrompts[prompt.prompt_name]}
                  className={`px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-1 ${
                    editedPrompts[prompt.prompt_name]
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-500"
                  } disabled:opacity-50`}
                >
                  <Save size={14} />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={() => onDeletePrompt(prompt.prompt_name)}
                  disabled={loading || (prompt.prompt_name === "system" && prompts.length === 1)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400 disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {prompts.length > 0 && (
        <div className="mt-4">
          <button
            onClick={onSaveAll}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-400 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            <span>Sauvegarder tous les prompts</span>
          </button>
        </div>
      )}
    </div>
  )
}

