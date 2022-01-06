import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from './context/appContext';
import { UserContext } from './context/userProvider';
import { MoodItem } from './moodItem.js';

export const CheckMood = () => {
    const {
        getCurrentUserTop,
        getPlaylists,
        setPlaylists,
        playlists,
        found,
        setFound
    } = useContext(AppContext);
    
    const {
        shareItem,
        spotifyUserState:{
        spotifyUser : {
            id
        }}
    } = useContext(UserContext);
    
    const history = useHistory();

    const [ view, setView] = useState(false);
    const [ type, setType ] = useState('artists');
    const [ amount, setAmount ] = useState(3);
    const [ timeframe, setTimeframe ] = useState('short_term');
    const [ mood, setMood ] = useState([]);

    useEffect(() => {
        // gets top on load
        getCurrentUserTop(type, amount, timeframe)
        .then(res => {
            const { items } = res
            setMood(items)
            // pulls only needed metadata from JSON object
            const forDB = items.map(item => {
                let selectionParsed
                if(item.type === 'artist'){
                return {
                    selectionName: item.name,
                    genres: item.genres ? item.genres.map(genre => genre) : null,
                    image: item.images[0] ? item.images[0].url : null,
                    href: item.external_urls.spotify,
                    type: item.type
                }
                } else if(item.type === 'track'){
                    return {
                        selectionName: item.album.name,
                        artists: item.artists.map(artist => artist.name),
                        image: item.album.images[0] ? item.album.images[0].url : null,
                        href: item.external_urls.spotify,
                        type: item.type
                    }
                }
                return selectionParsed
            })
        // setFound to the items w only needed data for mongo
            setFound(forDB)
        })
        .catch(err => console.log(err))
        getPlaylists(id)
        .then(res => {
            setPlaylists({
                items: res,
                total: res.length
            })
        })
        .catch(err => console.log(err))
        // cleanup function
        return () => {
            setMood('')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, amount, timeframe]);

    const mappedMood = mood && mood.map(item => <MoodItem color={'indigo'} item={item} key={item.id} setFound={setFound}/>);
    const mappedPlaylists = playlists && playlists.items.map(item => <MoodItem color={'indigo'} item={item} key={item.id}/>);

    return(
        <div className='grid container-main'>
        <div className='p-3 pt-4 bg-indigo-800 text-cyan-800 rounded'>
            <input onClick={() => history.goBack()} className='bg-cerise-700 text-xs text-cyan-50 font-bold btnbold-small' type='button' value='to profile'/>
            <input onClick={() => setView(prevState => !prevState)} value={`view ${view ? `recent` : `playlists`}`} title='click to check moods of spotify playlists' className='btn text-sm' type='button'/>
            { !view ?
            <>
                <form className='p-3 text-md text-cocoa-900 grid grid-cols-1 gap-3 pr-6 pl-6'>
                    <select className='bg-indigo-200 text-center text-indigo-800 text-sm rounded-full' onChange={e => setAmount(e.target.value)}>
                        <option value='3' > top 3 </option>
                        <option value='5'> top 5 </option>
                        <option value='8'> top 8 </option>
                        <option value='10'> top 10 </option>
                        <option value='15'> top 15 </option>
                        <option value='20'> top 20 </option>
                        <option value='25'> top 25 </option>
                        <option value='30'> top 30 </option>
                        <option value='40'> top 40 </option>
                        <option value='50'> top 50 </option>
                    </select>
                    <select className='bg-indigo-200 text-center text-sm text-indigo-800 rounded-full' onChange={e => setTimeframe(e.target.value)}>
                        <option value='short_term' > monthly </option>
                        <option value='medium_term' > biannual </option>
                        <option value='long_term'> annual </option>
                    </select>
                    <select className='bg-indigo-200 text-center text-indigo-800 text-sm rounded-full' onChange={e => setType(e.target.value)}>
                        <option value='artists' > artists </option>
                        <option value='tracks'> tracks </option>
                    </select>
                    <input onClick={() => shareItem(found, timeframe)} className='bg-indigo-600 text-indigo-50 font-medium text-md btn' type='button' title='post as your mood' value='post mood.'/>
                </form>
                <p className='text-sm text-cerise-50'> top <span className='text-xl'>{amount}</span> <span className='text-xl'> {type} </span> 
                    {timeframe === 'short_term' && ` these past 30 days`} 
                    {timeframe === 'medium_term' && ' these past 6 months'}
                    {timeframe === 'long_term' && ' the past year'} 
                </p>
                <div className=' p-3 rounded'>
                    {mappedMood || 'the vibe is off. refresh the page.'}
                </div>
            </>
            :
            // playlist view
            <div className='p-3 text-md text-cocoa-50 grid grid-cols-1 gap-3 pr-6 pl-6'>
                <p className='text-sm'> viewing <span className='text-xl'> {playlists.total} </span> playlists </p>
                {mappedPlaylists}
            </div>
            }
        </div>
        </div>
    )
};