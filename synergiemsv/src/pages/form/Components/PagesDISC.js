import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from '../Redux/pageSlice'
import { addKeyValue } from '../Redux/formSlice';
import { QuestionDISC } from "./QuestionDISC";
import { question1Array, question2Array, question3Array, question4Array } from "../questionArray";

export function PagesDISC() {
    
    const form = useSelector((state) => state.form);
    const {pageNum} = useSelector((state) => state.page)
        
    const dispatch = useDispatch();

    
    

   
    
    return (
        <div className="page">
            <h1>Question {pageNum}</h1>
            <QuestionDISC questionArray={question1Array}/>
            <QuestionDISC questionArray={question2Array}/>
            <QuestionDISC questionArray={question3Array}/>
            <QuestionDISC questionArray={question4Array}/>
            <button onClick={() => dispatch(removePage())}>Back</button>
            <button onClick={() => dispatch(addPage())}>Next</button>
        </div>
    )
}