import React, { useState, useContext } from 'react';
import { AppContext } from '../context/appContext.js';

export const SearchBar = () => {
    const { 
        search
    } = useContext(AppContext);

    const [ inputs, setInputs ] = useState('');

    function handleSubmit(e){
        e.preventDefault()
        search(inputs)
        setInputs('')
    };

    return(
        <form className='grid' onSubmit={handleSubmit}>
            <span className='text-left grid grid-cols-4'>
                    <input className='col-span-4 text-indigo-900 p-1 w-full rounded' type='text' value={inputs} onChange={e => setInputs(e.target.value)} placeholder={`What's their username?`} required/>
            </span>
            <button className='bg-cyan-200 text-cyan-800 btn'> find friend </button> 
        </form>
    )
};