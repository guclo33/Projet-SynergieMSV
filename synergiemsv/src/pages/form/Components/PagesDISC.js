import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from '../Redux/pageSlice'
import { addKeyValue } from '../Redux/formSlice';
import { QuestionDISC } from "./QuestionDISC";
import { question1Array, question2Array, question3Array, question4Array } from "../questionArray";

export function PagesDISC() {
    const [validated, setValidated] = useState(false)
    const [repondu, setRepondu] = useState(false);
    const [different, setDifferent] = useState(false);
    const [minMax, setMinMax] = useState(false)
    const form = useSelector((state) => state.form);
    const {pageNum} = useSelector((state) => state.page)
        
    const dispatch = useDispatch();
    const questionNum = pageNum - 1
    const pageArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]

    const answersArray = [form[question1Array[questionNum]], form[question2Array[questionNum]], form[question3Array[questionNum]], form[question4Array[questionNum]]];

    console.log("AnswerArray =", answersArray)

    useEffect(() => {
        if(form[question1Array[questionNum]] && form[question2Array[questionNum]] && form[question3Array[questionNum]] && form[question4Array[questionNum]]){
            setRepondu(true)
        } else {
        setRepondu(false)
        }

    }, [answersArray])

    useEffect(()=>{
        const valeursUnique = new Set(answersArray)
        console.log("valeurUnique", valeursUnique, "answersArray length", answersArray.length, "valeurUnique length", valeursUnique.size)
        if(answersArray.length === valeursUnique.size) {
            setDifferent(true)
        } else {
        setDifferent(false)
        }
    },[answersArray])

    useEffect(() => {
        if(answersArray.includes("0") && answersArray.includes("10")) {
            setMinMax(true)
        } else {
        setMinMax(false)
        }
    }, [answersArray])

    useEffect(()=> {
        if(repondu && different && minMax){
            setValidated(true)
        } else if(pageNum===0) {
        setValidated(true)
        } else {
            setValidated(false)
        }
    }, [repondu, different, minMax])
    
    console.log("different = ", different, "repondu=", repondu, "minMax=", minMax, "validated =", validated)

   console.log("pageArray.slice(0,pageNum+1)", pageArray.slice(0,pageNum+1))
    
    return (
        <div className="page">
            <h1>Question {pageNum}</h1>
            <QuestionDISC questionArray={question1Array}/>
            <QuestionDISC questionArray={question2Array}/>
            <QuestionDISC questionArray={question3Array}/>
            <QuestionDISC questionArray={question4Array}/>
            <span style={{ color: repondu? "green" : "red"}}>Toutes les questions sont répondues</span>
            <span style={{ color: different? "green" : "red"}}>Toutes les réponses sont différentes</span>
            <span style={{ color: minMax? "green" : "red"}}>Tu as une réponse à 0 et une à 10</span>
            <div className="formButton">
                <button onClick={() => dispatch(removePage())}>Retour</button>
                <button 
                    disabled={!validated}
                    style={{
                        backgroundColor: !validated ? '#ccc' : '#4CAF50',  
                        cursor: !validated ? 'not-allowed' : 'pointer',    
                        boxShadow: !validated ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',  
                        opacity: !validated ? 0.4 : 1,  
                    }} 
                    onClick={() => dispatch(addPage())}>Suivant</button>
            </div>
            <div className="setPage">
                    {pageArray.slice(0,pageNum+1).map( num => ( 
                        <p key={num} onClick={(e) => dispatch(setPage(num))}>{num}</p>
                    ))
                    }
            </div>
        </div>
    )
}