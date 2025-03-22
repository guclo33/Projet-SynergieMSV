"use client"

import { useState, useRef, useEffect } from "react"
import { PlusCircle, Save, Trash2, MoveUp, MoveDown } from "lucide-react"

export function PromptEditor({
  prompts,
  onUpdatePrompt,
  onAddPrompt,
  onDeletePrompt,
  onSaveAll,
  onSavePrompt,
  onUpdatePromptName,
  onReorderPrompt,
  loading,
}) {
  const [newPromptName, setNewPromptName] = useState("")
  const [editedPrompts, setEditedPrompts] = useState({})
  const [editingName, setEditingName] = useState(null)
  const [editedName, setEditedName] = useState("")
  const nameInputRef = useRef(null)

  // Add a reference to the original prompt values from the parent component
  const originalPromptValues = useRef({})

  // Update originalPromptValues when prompts change
  useEffect(() => {
    // Extract original values from the parent component
    const originalValues = {}
    prompts.forEach((prompt) => {
      if (!originalValues[prompt.prompt_name]) {
        originalValues[prompt.prompt_name] = prompt.value
      }
    })
    originalPromptValues.current = originalValues
  }, [prompts])

  const handleAddPrompt = () => {
    if (newPromptName.trim() && !prompts.some((p) => p.prompt_name === newPromptName)) {
      onAddPrompt(newPromptName)
      setNewPromptName("")
    }
  }

  const handlePromptChange = (name, value) => {
    // Get the current prompt
    const prompt = prompts.find((p) => p.prompt_name === name)
    if (!prompt) return

    // Compare with original value from the database
    const isModified = value !== originalPromptValues.current[name]

    // Only mark as edited if the value is different from the original
    if (isModified) {
      setEditedPrompts((prev) => ({
        ...prev,
        [name]: true,
      }))
    } else {
      // If it matches the original, remove the edited flag
      setEditedPrompts((prev) => {
        const newState = { ...prev }
        delete newState[name]
        return newState
      })
    }

    // Update the prompt value
    onUpdatePrompt(name, value)
  }

  const handleSavePrompt = (name) => {
    onSavePrompt(name)
    // Clear the edited flag after saving
    setEditedPrompts((prev) => {
      const newState = { ...prev }
      delete newState[name]
      return newState
    })

    // Update the original value reference
    const prompt = prompts.find((p) => p.prompt_name === name)
    if (prompt) {
      originalPromptValues.current[name] = prompt.value
    }
  }

  const startEditingName = (prompt) => {
    setEditingName(prompt.prompt_name)
    setEditedName(prompt.prompt_name)
    // Focus the input after it renders
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus()
      }
    }, 0)
  }

  const saveEditedName = (oldName) => {
    if (editedName && editedName !== oldName && !prompts.some((p) => p.prompt_name === editedName)) {
      onUpdatePromptName(oldName, editedName)
    }
    setEditingName(null)
  }

  const handleMovePrompt = (index, direction) => {
    const newPosition = direction === "up" ? index - 1 : index + 1
    if (newPosition >= 0 && newPosition < prompts.length) {
      onReorderPrompt(index, newPosition)

      // Marquer tous les prompts comme modifiés après réarrangement
      const updatedEditedPrompts = {}
      prompts.forEach((prompt) => {
        updatedEditedPrompts[prompt.prompt_name] = true
      })
      setEditedPrompts(updatedEditedPrompts)
    }
  }

  // Modify the handleSaveAll function to clear all edited flags
  const handleSaveAll = () => {
    onSaveAll()
    // Clear all edited flags after saving all prompts
    setEditedPrompts({})

    // Update all original values in our reference
    prompts.forEach((prompt) => {
      originalPromptValues.current[prompt.prompt_name] = prompt.value
    })
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
              <div className="font-medium text-lg mb-2 text-purple-700 flex items-center justify-between">
                <div className="flex items-center">
                  {editingName === prompt.prompt_name ? (
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onBlur={() => saveEditedName(prompt.prompt_name)}
                      onKeyDown={(e) => e.key === "Enter" && saveEditedName(prompt.prompt_name)}
                      className="border border-purple-300 rounded px-2 py-1 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span
                      onClick={() => prompt.prompt_name !== "system" && startEditingName(prompt)}
                      className={prompt.prompt_name !== "system" ? "cursor-pointer hover:underline" : ""}
                    >
                      {prompt.prompt_name}
                    </span>
                  )}
                  {prompt.prompt_name === "system" && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Obligatoire</span>
                  )}
                  {editedPrompts[prompt.prompt_name] && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modifié</span>
                  )}
                  <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Position: {prompt.prompt_number || index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMovePrompt(index, "up")}
                    disabled={index === 0 || loading}
                    className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 text-white disabled:opacity-50 disabled:hover:from-purple-300 disabled:hover:to-purple-400 shadow-sm transition-all"
                    title="Déplacer vers le haut"
                  >
                    <MoveUp size={18} />
                  </button>
                  <button
                    onClick={() => handleMovePrompt(index, "down")}
                    disabled={index === prompts.length - 1 || loading}
                    className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white disabled:opacity-50 disabled:hover:from-purple-500 disabled:hover:to-purple-700 shadow-sm transition-all"
                    title="Déplacer vers le bas"
                  >
                    <MoveDown size={18} />
                  </button>
                </div>
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
                  className={`px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2 shadow-sm transition-all ${
                    editedPrompts[prompt.prompt_name]
                      ? "bg-gradient-to-r from-purple-300 to-purple-500 text-white hover:from-purple-400 hover:to-purple-600"
                      : "bg-gray-200 text-gray-500"
                  } disabled:opacity-50`}
                >
                  <Save size={16} />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={() => onDeletePrompt(prompt.prompt_name)}
                  disabled={loading || (prompt.prompt_name === "system" && prompts.length === 1)}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-md text-sm hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
                >
                  <Trash2 size={16} />
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
            onClick={handleSaveAll}
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

