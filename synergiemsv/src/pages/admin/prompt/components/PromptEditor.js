"use client"

import { useState } from "react"

export function PromptEditor({ prompts, onUpdatePrompt, onAddPrompt, onDeletePrompt, onSaveAll }) {
  const [newPromptName, setNewPromptName] = useState("")

  const handleAddPrompt = () => {
    if (newPromptName.trim() && !prompts.some((p) => p.name === newPromptName)) {
      onAddPrompt(newPromptName)
      setNewPromptName("")
    }
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
          className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap"
        >
          + Ajouter un prompt
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {prompts.map((prompt) => (
          <div key={prompt.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="font-medium text-lg mb-2 text-purple-700">{prompt.name}</div>
            <div className="mb-2">
              <div className="text-sm text-gray-600 mb-1">Contenu du prompt</div>
              <textarea
                value={prompt.value}
                onChange={(e) => onUpdatePrompt(prompt.name, e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => onDeletePrompt(prompt.name)}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {prompts.length > 0 && (
        <div className="mt-4">
          <button
            onClick={onSaveAll}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Sauvegarder tous les prompts
          </button>
        </div>
      )}
    </div>
  )
}

