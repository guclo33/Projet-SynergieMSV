import React, {useState} from 'react';

export function PromptEdit () {
    
    const [prompt, setprompt] = useState([]);;
    
    

    const handleChange = (promptId, field, newValue) => {
        setprompt((prev) =>
          prev.map((q) => {
            if (q.id === promptId) {
              return { ...q, [field]: newValue };
            }
            return q;
          })
        );
      };
    
      // Grouper par prompt_number (les "grandes prompt")
      const groupedByNumber = prompt.reduce((acc, promptObj) => {
        const num = promptObj.prompt_number;
        if (!acc[num]) {
          acc[num] = [];
        }
        acc[num].push(promptObj);
        return acc;
      }, {});
    
      // Affiche chaque groupe dans l'ordre prompt_order
      const renderGroups = () => {
        return Object.entries(groupedByNumber).map(([promptNumber, items]) => {
          const num = parseInt(promptNumber, 10);
          // Trier par prompt_order
          const sortedItems = items.sort(
            (a, b) => a.prompt_order - b.prompt_order
          );
    
          return (
            <div
              key={num}
              className="bg-white shadow-sm rounded-lg p-4 mb-6"
            >
              <h2 className="text-2xl font-bold mb-4">prompt {num}</h2>
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center h-[3rem]">
                    {/* Label de la prompt (ex: "Quelle est votre couleur préférée ?") */}
                    <input
                      type="text"
                      className="col-span-3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={item.value}
                      onChange={(e) => handleChange(item.id, "value", e.target.value)}
                    />
    
                    {/* Sélecteur de couleur */}
                    <select
                      className="h-[3rem] border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={item.color}
                      onChange={(e) => handleChange(item.id, "color", e.target.value)}
                    >
                      <option value="rouge">rouge</option>
                      <option value="vert">vert</option>
                      <option value="bleu">bleu</option>
                      <option value="jaune">jaune</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        });
      };
    
      return (
        <div className="max-w-[90%] mx-auto p-4">
          <h1 className="text-3xl font-extrabold mb-6">Édition des prompt</h1>
          {renderGroups()}
    
          {/* Affichage JSON (optionnel) */}
          <div className="bg-gray-50 border border-gray-100 p-2 rounded">
            <h3 className="font-semibold mb-2">Aperçu des données :</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(prompt, null, 2)}
            </pre>
          </div>
        </div>
      );
    }