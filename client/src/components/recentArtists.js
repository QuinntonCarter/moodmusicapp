import { useContext } from 'react';
import { AppContext } from './context/appContext';
import { MoodItem } from './moodItem.js';

export const RecentArtists = () => {
    const {
        monthlyArtists
    } = useContext(AppContext)

    const mappedArtists = monthlyArtists.items && 
        monthlyArtists.items.map(artist => <MoodItem color={'navy'} item={artist}/>)

    return(
        <div className='p-3'>
            <ol>
                {mappedArtists}
            </ol>
        </div>
    )
}