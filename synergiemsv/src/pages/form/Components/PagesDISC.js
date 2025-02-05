import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from '../Redux/pageSlice'
import { addValueForm } from '../Redux/formSlice';
import { QuestionDISC } from "./QuestionDISC";
import { question1Array, question2Array, question3Array, question4Array } from "../questionArray";

export function PagesDISC() {
    const [validated, setValidated] = useState(false)
    const [repondu, setRepondu] = useState(false);
    const [different, setDifferent] = useState(false);
    const [minMax, setMinMax] = useState(false)
    const {form, info} = useSelector((state) => state.session.form);
    const {pageNum, totalPage} = useSelector((state) => state.session.page)
        
    const dispatch = useDispatch();
    const questionNum = pageNum - 1
    const pageArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]

    const answersArray = [form[question1Array[questionNum]], form[question2Array[questionNum]], form[question3Array[questionNum]], form[question4Array[questionNum]]];

    console.log("AnswerArray =", answersArray)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, [pageNum, totalPage]);

    useEffect(() => {
        if( form[question1Array[questionNum]] >= 0 && form[question1Array[questionNum]] <= 10 && form[question2Array[questionNum]] >=0 && form[question2Array[questionNum]] <=10 && form[question3Array[questionNum]] >=0 && form[question3Array[questionNum]] <=10 && form[question4Array[questionNum]] >= 0 && form[question4Array[questionNum]] <= 10){
            setRepondu(true)
        } else {
        setRepondu(false)
        }

    }, [answersArray])

    console.log("FORM=", form, "INFO=", info)

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
        if(answersArray.includes(0) && answersArray.includes(10)) {
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

   const handleNextPage = ()=> {
        dispatch(addPage());
   }

    const handleSetPage = (num) => {
        
        if(!validated && num-1>pageNum){
            return
        }
        dispatch(setPage(num-1))
        
    }
    
    return (
        <div className="page">
            <h1>Question {pageNum} sur 25</h1>
            <QuestionDISC questionArray={question1Array}/>
            <QuestionDISC questionArray={question2Array}/>
            <QuestionDISC questionArray={question3Array}/>
            <QuestionDISC questionArray={question4Array}/>
            <span style={{ color: repondu? "green" : "red"}}>Toutes les questions sont répondues</span>
            <span style={{ color: different? "green" : "red"}}>Toutes les réponses sont différentes</span>
            <span style={{ color: minMax? "green" : "red"}}>Tu dois avoir une sélection correspondant à 0 ainsi qu'une à 10</span>
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
                    onClick={handleNextPage}>Suivant</button>
            </div>
            <div className="setPage">
                <h5>Retourner à la page :</h5>
                <div className="setPageNumber">
                    {pageArray.slice(0,totalPage+1).map( num => ( 
                        <p 
                        style={{
                            //backgroundColor: (!validated && pageNum === num-1) ? "red" : "white",
                            filter: pageNum === num - 1 ? "brightness(0.8)" : "none"
                        }}
                        id={num} key={num} onClick={() => handleSetPage(num)}>{num}</p>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}