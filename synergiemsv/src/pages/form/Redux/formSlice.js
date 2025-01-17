
import { createSlice } from "@reduxjs/toolkit";

const initialState = []

let counterValue = 0;
const counter = () => {
    return ++counterValue
}


const formSlice = createSlice({
    name: "form",
    initialState: initialState,
    reducers: {
        setForm(state,action) {
            state.push({
                id: counter(),
                nom: action.payload,
                manchesGame: 0,
                partiesGame : 0,
                pointsGame: 0,
                enchere: [],
                enchereAtout: [],
                manchesGagnees: [],
                partiesGagnees: [],
                pointsHist: [],
                leveesHist: [],
                nbBrasseTotal:0,
                nbPartieTotal:0,
                nbMancheTotal:0,
                date: Date.now()
            })
        },
        removeJoueur(state,action){
            const id = action.payload
            return state.filter(joueur => joueur.id !== id);
            },

        }
})

export const {
    addJoueur,
    

} = formSlice.actions

export default formSlice.reducer