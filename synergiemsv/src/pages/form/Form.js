import React, {useContext, useState} from 'react';
import { AuthContext } from '../AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from './Redux/pageSlice'
import { addKeyValue } from './Redux/formSlice';
import './form.css';
import { FirstPage } from './Components/FirstPage';
import { PagesDISC } from './Components/PagesDISC';
import { QuestionsDev } from './Components/QuestionsDev';



export function Form() {
    const [file, setFile] = useState(null)
    const { user} = useContext(AuthContext);
    const form = useSelector((state) => state.form);
    const {pageNum} = useSelector((state) => state.page);
    const dispatch = useDispatch();

    console.log("page",pageNum)

    


  return (
        <div className="questionnaire">
            <h1>Questionnaire Synergia</h1>
            {pageNum === 0 ?
                (
                    <FirstPage file={file} setFile={setFile} />
                ): pageNum === 25 ? (
                    <QuestionsDev file={file}/>
                ):(
                    <PagesDISC />
                )}
                
        </div>
  );
}