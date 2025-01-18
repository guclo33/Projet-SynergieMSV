import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from '../Redux/pageSlice'
import { addKeyValue } from '../Redux/formSlice';

export function QuestionDISC({questionArray}) {
    
    const form = useSelector((state) => state.form);
    const {pageNum} = useSelector((state) => state.page)
        
    const dispatch = useDispatch();



    return (
        <div>
            
        </div>
    )
}