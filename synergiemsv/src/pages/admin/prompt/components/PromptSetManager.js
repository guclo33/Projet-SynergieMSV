"use client"

export function PromptSetManager({ promptSets, selectedSetId, onSelectSet, onDeleteSet, onOpenAddModal }) {
  return (
    <div>
      <div className="form-group">
        <label className="form-label" htmlFor="prompt-set">
          Ensemble de Prompts
        </label>
        <div className="flex gap-2">
          <select
            id="prompt-set"
            value={selectedSetId}
            onChange={(e) => onSelectSet(e.target.value)}
            className="form-select"
          >
            <option value="" disabled>
              Sélectionnez un ensemble de prompt
            </option>
            {promptSets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>

          <button className="btn btn-outline" onClick={onOpenAddModal}>
            +
          </button>

          {selectedSetId && (
            <button className="btn btn-danger" onClick={() => onDeleteSet(selectedSetId)}>
              ×
            </button>
          )}
        </div>
      </div>

      {selectedSetId && (
        <div className="mt-2">
          <p style={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Ensemble sélectionné: {promptSets.find((set) => set.id === selectedSetId)?.name}
          </p>
        </div>
      )}
    </div>
  )
}

