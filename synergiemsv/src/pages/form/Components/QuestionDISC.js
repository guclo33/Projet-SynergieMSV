import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from '../Redux/pageSlice'
import { addKeyValue } from '../Redux/formSlice';

export function QuestionDISC({questionArray}) {
    
    const form = useSelector((state) => state.form);
    const {pageNum} = useSelector((state) => state.page)
    const questionNum = pageNum - 1
        
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch(addKeyValue({key: name, value: value}))
    }

    return (
        <div className="questionDISC">
            <h3>{questionArray[questionNum]}</h3>
            <input className="rangeInput" type="range" min="0" max="10" name={questionArray[questionNum]} value={form[questionArray[questionNum]] ? form[questionArray[questionNum]] : "" } onChange={handleChange} />
            <div class="range-labels">
                <span>0</span>
                <span>Votre sélection: {form[questionArray[questionNum]]}</span>  
                <span>10</span>
            </div>
            
        </div>
    )
}