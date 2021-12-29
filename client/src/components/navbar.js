import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './context/appContext';
import { UserContext } from './context/userProvider';

export const Navbar = () => {
    const {
        logout
    } = useContext(UserContext);
    const {
        found,
        setFound
    } = useContext(AppContext);
    // resets found to nothing to prevent rendering issues between search results
    const conditionalReset = (found) => found && setFound('');
    
    return(
        <div className='flex flex-row justify-evenly fixed bottom-0 w-screen bg-navy-800'>
            <Link className='w-full p-3 pl-5' to='/recent_mood_artists'> <button> profile </button> </Link>
            <Link className='w-full p-3' to='/lists'> <button> friends </button> </Link>
            <Link className='w-full p-3' to='/search' onClick={() => conditionalReset(found)}> <button> search </button> </Link>
            <button className='bg-cerise-700 w-full p-1' onClick={logout}> logout </button>
        </div>
    )
};