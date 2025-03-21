"use client"

import { useState } from "react"
import { PlusCircle, X, RefreshCw } from "lucide-react"

export function PromptSetSelector({ promptSets, selectedSetId, onSelectSet, onAddSet, onDeleteSet, loading }) {
  const [isAddingSet, setIsAddingSet] = useState(false)
  const [newSetName, setNewSetName] = useState("")

  const handleAddSet = () => {
    if (newSetName.trim()) {
      onAddSet(newSetName)
      setNewSetName("")
      setIsAddingSet(false)
    }
  }

  const handleClearSelection = () => {
    onSelectSet("")
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
                disabled={loading}
                className="bg-purple-700 text-white rounded-md px-3 py-2 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400 flex items-center gap-1"
              >
                <PlusCircle size={16} />
                <span>Créer</span>
              </button>
              <button
                onClick={() => setIsAddingSet(false)}
                className="bg-gray-200 text-gray-700 rounded-md px-3 py-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-1"
              >
                <X size={16} />
                <span>Annuler</span>
              </button>
            </div>
          ) : (
            <>
              <select
                value={selectedSetId}
                onChange={(e) => onSelectSet(e.target.value)}
                disabled={loading || promptSets.length === 0}
                className="border border-gray-300 rounded-md px-3 py-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                {promptSets.length === 0 ? (
                  <option value="">Aucun ensemble disponible</option>
                ) : (
                  <>
                    <option value="">Sélectionner un ensemble</option>
                    {promptSets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <button
                onClick={() => setIsAddingSet(true)}
                disabled={loading}
                title="Nouveau ensemble de prompts"
                className="bg-purple-700 text-white rounded-md px-3 py-2 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400 flex items-center gap-1"
              >
                <PlusCircle size={16} />
                <span>Nouveau</span>
              </button>
              {selectedSetId && (
                <button
                  onClick={handleClearSelection}
                  disabled={loading}
                  title="Retirer de la sélection"
                  className="bg-gray-200 text-gray-700 rounded-md px-3 py-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-1"
                >
                  <RefreshCw size={16} />
                  <span>Réinitialiser</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {selectedSetId && <p className="text-sm text-gray-600">Ensemble sélectionné: {selectedSet?.name}</p>}
      {loading && <p className="text-sm text-blue-600 mt-2">Chargement en cours...</p>}
    </div>
  )
}

