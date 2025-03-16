"use client"

import { useState } from "react"

export function PromptSetSelector({ promptSets, selectedSetId, onSelectSet, onAddSet, onDeleteSet }) {
  const [isAddingSet, setIsAddingSet] = useState(false)
  const [newSetName, setNewSetName] = useState("")

  const handleAddSet = () => {
    if (newSetName.trim()) {
      onAddSet(newSetName)
      setNewSetName("")
      setIsAddingSet(false)
    }
  }

  const selectedSet = promptSets.find((set) => set.id === selectedSetId)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-medium text-purple-800">Ensemble de Prompts</h3>
        <div className="flex items-center gap-2">
          {isAddingSet ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                placeholder="Nom du nouvel ensemble..."
                className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAddSet}
                className="bg-purple-700 text-white rounded-md p-2 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                +
              </button>
              <button
                onClick={() => setIsAddingSet(false)}
                className="bg-red-600 text-white rounded-md p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <select
                value={selectedSetId}
                onChange={(e) => onSelectSet(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {promptSets.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsAddingSet(true)}
                className="bg-purple-700 text-white rounded-md p-2 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                +
              </button>
              {selectedSetId && (
                <button
                  onClick={() => onDeleteSet(selectedSetId)}
                  className="bg-red-600 text-white rounded-md p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {selectedSetId && <p className="text-sm text-gray-600">Ensemble sélectionné: {selectedSet?.name}</p>}
    </div>
  )
}

