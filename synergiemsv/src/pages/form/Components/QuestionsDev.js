import React, { useState, useEffect } from "react";
import { questionDev1, questionDev2, questionDev3 } from "../questionArray";
import { useDispatch, useSelector } from "react-redux";
import { addKeyValue } from "../Redux/formSlice";
import { addPage, removePage } from "../Redux/pageSlice";

export function QuestionsDev ({file}) {
    const [validated, setValidated] = useState(false)
    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    const page = useSelector((state) => state.page);

    useEffect(() => {
        if(form[questionDev1] && form[questionDev2] && form[questionDev3]) {
            setValidated(true)
        } else {
            validated(false)
        }
    },[form])

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch(addKeyValue({key: name, value: value}))
    }

    const handleSubmit = () => {
        
    }
    
    return(
        <div className="page">
            <h2>Questions à développement</h2>
            <div className="questionDev">
                <h3>{questionDev1}</h3>
                <textarea  name={questionDev1} value={form[questionDev1] ? form[questionDev1] : ""} onChange={handleChange} />
            </div>
            <div className="questionDev">
                <h3>{questionDev2}</h3>
                <textarea type="text" name={questionDev2} value={form[questionDev2] ? form[questionDev2] : ""} onChange={handleChange} />
            </div>
            <div className="questionDev">
                <h3>{questionDev3}</h3>
                <textarea type="text" name={questionDev3} value={form[questionDev3] ? form[questionDev3] : ""} onChange={handleChange} />
            </div>
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
                    onClick={handleSubmit}>Soumettre
                </button>
            </div>
        </div>
    )
}