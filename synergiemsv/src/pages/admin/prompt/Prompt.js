import React from 'react';
import { useState, useEffect } from 'react';
import { PromptEdit } from './components/PromptEdit';


export function Prompt() {
        const [questionSets, setQuestionSets] = useState([{id: 1, name: 'Set 1'}, {id: 2, name: 'Set 2'}]);
        const [selectedSet, setSelectedSet] = useState('');

            /*useEffect(() => {
                // Fetch question sets from the database
                async function fetchQuestionSets() {
                    const response = await fetch('/api/question-sets');
                    const data = await response.json();
                    setQuestionSets(data);
                }

                fetchQuestionSets();
            }, []);*/

            return (
                <div className="m-[6rem]">
                    <h1 className='content-center'>test des prompt</h1>
                    <select
                        value={selectedSet}
                        onChange={(e) => setSelectedSet(e.target.value)}
                        className="p-2 border rounded h-[3rem] justify-center"
                    >
                        <option value="" disabled>
                            Sélectionnez un ensemble de prompt
                        </option>
                        {questionSets.map((set) => (
                            <option key={set.id} value={set.id}>
                                {set.name}
                            </option>
                        ))}
                    </select>
                    <PromptEdit />
            </div>
        );
}