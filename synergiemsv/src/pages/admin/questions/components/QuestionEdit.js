import React, {useState} from 'react';

export function QuestionEdit () {
    
    const [questions, setQuestions] = useState([{
        id: 1,
        form_name: "Form A",
        question_number: 1,
        question_order: 1,
        value: "Quelle est votre couleur préférée ?",
        color: "rouge",
      },
      {
        id: 2,
        form_name: "Form A",
        question_number: 1,
        question_order: 2,
        value: "Aimez-vous le chocolat ?",
        color: "vert",
      },
      {
        id: 3,
        form_name: "Form A",
        question_number: 1,
        question_order: 3,
        value: "Combien de fois par jour buvez-vous du café ?",
        color: "bleu",
      },
      {
        id: 4,
        form_name: "Form A",
        question_number: 1,
        question_order: 4,
        value: "Préférez-vous le thé ?",
        color: "jaune",
      },
    
      // Grande question n°2 (question_number = 2)
      {
        id: 5,
        form_name: "Form A",
        question_number: 2,
        question_order: 1,
        value: "Votre fruit favori ?",
        color: "rouge",
      },
      {
        id: 6,
        form_name: "Form A",
        question_number: 2,
        question_order: 2,
        value: "Aimez-vous les légumes verts ?",
        color: "vert",
      },
      {
        id: 7,
        form_name: "Form A",
        question_number: 2,
        question_order: 3,
        value: "Quels légumes consommez-vous le plus ?",
        color: "bleu",
      },
      {
        id: 8,
        form_name: "Form A",
        question_number: 2,
        question_order: 4,
        value: "Combien de portions de fruits par jour ?",
        color: "jaune",
      },
    
      // Grande question n°3 (question_number = 3)
      {
        id: 9,
        form_name: "Form A",
        question_number: 3,
        question_order: 1,
        value: "Quel est votre moyen de transport principal ?",
        color: "rouge",
      },
      {
        id: 10,
        form_name: "Form A",
        question_number: 3,
        question_order: 2,
        value: "Combien de km parcourez-vous par semaine ?",
        color: "vert",
      },
      {
        id: 11,
        form_name: "Form A",
        question_number: 3,
        question_order: 3,
        value: "Pratiquez-vous le covoiturage ?",
        color: "bleu",
      },
      {
        id: 12,
        form_name: "Form A",
        question_number: 3,
        question_order: 4,
        value: "Avez-vous un vélo ?",
        color: "jaune",
      },
    ]);;
    
    

    const handleChange = (questionId, field, newValue) => {
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id === questionId) {
              return { ...q, [field]: newValue };
            }
            return q;
          })
        );
      };
    
      // Grouper par question_number (les "grandes questions")
      const groupedByNumber = questions.reduce((acc, questionObj) => {
        const num = questionObj.question_number;
        if (!acc[num]) {
          acc[num] = [];
        }
        acc[num].push(questionObj);
        return acc;
      }, {});
    
      // Affiche chaque groupe dans l'ordre question_order
      const renderGroups = () => {
        return Object.entries(groupedByNumber).map(([questionNumber, items]) => {
          const num = parseInt(questionNumber, 10);
          // Trier par question_order
          const sortedItems = items.sort(
            (a, b) => a.question_order - b.question_order
          );
    
          return (
            <div
              key={num}
              className="bg-white shadow-sm rounded-lg p-4 mb-6"
            >
              <h2 className="text-2xl font-bold mb-4">Question {num}</h2>
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center h-[3rem]">
                    {/* Label de la question (ex: "Quelle est votre couleur préférée ?") */}
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
          <h1 className="text-3xl font-extrabold mb-6">Édition des questions</h1>
          {renderGroups()}
    
          {/* Affichage JSON (optionnel) */}
          <div className="bg-gray-50 border border-gray-100 p-2 rounded">
            <h3 className="font-semibold mb-2">Aperçu des données :</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(questions, null, 2)}
            </pre>
          </div>
        </div>
      );
    }