import React, { useState } from 'react';
import { Questions } from '../questions/Questions';
import { Prompt } from '../prompt/Prompt';

export function FormSettings() {
    const [activeTab, setActiveTab] = useState('questions');

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-xl my-[6rem]">
            {/* Conteneur fixe des onglets */}
            <div className=" bg-white z-10 flex gap-10 border-b border-gray-300">
                <button 
                    className={`flex-1 py-3 text-lg font-semibold transition-opacity duration-300 ${activeTab === 'questions' ? 'border-b-4 border-pink-600 text-white opacity-100' : 'text-gray-500 opacity-50 hover:opacity-100'}`} 
                    onClick={() => setActiveTab('questions')}
                >
                    Personnalisation des questions
                </button>
                <button 
                    className={`flex-1 py-3 text-lg font-semibold transition-opacity duration-300 ${activeTab === 'prompts' ? 'border-b-4 border-pink-600 text-white opacity-100' : 'text-gray-500 opacity-50 hover:opacity-100'}`} 
                    onClick={() => setActiveTab('prompts')}
                >
                    Personnalisation des prompts
                </button>
            </div>

            {/* Contenu dynamique selon l'onglet sélectionné */}
            <div className="mt-6">
                {activeTab === 'questions' ? <Questions /> : <Prompt />}
            </div>
        </div>
    );
}
