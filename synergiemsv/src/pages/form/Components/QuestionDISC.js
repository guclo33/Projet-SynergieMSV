import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from '../Redux/pageSlice'
import { addKeyValue } from '../Redux/formSlice';

export function QuestionDISC({questionArray}) {
    
    const form = useSelector((state) => state.session.form);
    const {pageNum} = useSelector((state) => state.session.page)
    const questionNum = pageNum - 1
        
    const dispatch = useDispatch();

    useEffect(() => {
        if (form[questionArray[questionNum]] === undefined) {
            dispatch(addKeyValue({ key: questionArray[questionNum], value: 5 }));
        }
    }, [form, questionArray, questionNum, dispatch])

    const handleChange = (e) => {
        const {name, value} = e.target;
        const numericValue = value !== "" && !isNaN(value) ? Number(value) : value;
        dispatch(addKeyValue({key: name, value: numericValue}))
    }

    return (
        <div className="questionDISC">
            <h3>{questionArray[questionNum]}</h3>
            <input className="rangeInput" type="range" min="0" max="10" name={questionArray[questionNum]} value={form[questionArray[questionNum]] ?? 5} onChange={handleChange} />
            <div class="range-labels">
                <span>0</span>
                <span>Votre sélection: {form[questionArray[questionNum]]}</span>  
                <span>10</span>
            </div>
            
        </div>
    )
}