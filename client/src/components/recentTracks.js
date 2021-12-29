import { useContext } from 'react';
import { AppContext } from './context/appContext';
import { MoodItem } from './moodItem';

export const RecentTracks = () => {
    const {
        monthlyTracks
    } = useContext(AppContext)

    const mappedTracks = monthlyTracks.items && 
        monthlyTracks.items.map(artist => <MoodItem color={'navy'} item={artist} />)

    return(
        <div className='p-3'>
            {mappedTracks}
        </div>
    )
}