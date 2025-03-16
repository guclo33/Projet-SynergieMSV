"use client"

export function ResponseViewer({ inputText, setInputText, responses, onProcessInput }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-medium text-purple-800 mb-4">Réponses Générées</h3>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Texte à traiter</div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Entrez le texte à traiter avec les prompts..."
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={onProcessInput}
          className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Traiter le texte
        </button>
      </div>

      {responses.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {responses.map((response, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-purple-700">{response.promptName}</span>
                <span className="text-xs text-gray-500">{response.timestamp}</span>
              </div>
              <div className="text-sm text-gray-800">{response.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
          <p>Aucune réponse générée. Entrez du texte et cliquez sur "Traiter le texte" pour voir les résultats.</p>
        </div>
      )}
    </div>
  )
}

