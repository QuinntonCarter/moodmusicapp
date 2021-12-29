import { useContext } from 'react';
import { ResultDetails } from './resultDetails.js';
import { AppContext } from './context/appContext.js';

export const ResultComp = () => {
    const {
        found
        } = useContext(AppContext);

        const mappedResults = found && found.map(item =>
            <ResultDetails
                username={item.username}
                title={item.title && item.title}
                mood={item.mood && item.mood}
                id={item._id || item.id}
            />
        );

    return(
        <div className='grid mt-2 bg-cyan-600'>
            {mappedResults}
        </div> 
    )
};