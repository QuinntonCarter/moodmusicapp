import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './context/appContext.js';

export const ResultDetails = props => {
    const {
        id,
        username,
        title,
        mood,
        item
    } = props;

    const {
        getSelection
    } = useContext(AppContext);

    const location = props.username ? 'user' : 'results'

    return(
        <div onClick={() => getSelection(id, location)} className='bg-indigo-500 p-2 rounded'>
            <Link to={`/${location}/${id}`}>
                <p> {username || title || item.name} </p>
            </Link>
            { mood }
        </div>
    )
};