import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from './context/appContext';

export const MoodItem = props => {
    const {
        item,
        color
    } = props;

    const {
        getPlaylistTracks,
        setFound
    } = useContext(AppContext);

    let selectionParsed
    
    // lost on every render warning, but it's intentional
    useEffect(() => {
        if(item.type === 'playlist'){
            // eslint-disable-next-line react-hooks/exhaustive-deps
            selectionParsed = {
                    name: item.name,
                    description: item.description ? item.description : null,
                    owner: item.owner.display_name,
                    ownerProfile: item.owner.external_urls.spotify,
                    image: item.images[0] ? item.images[0].url : null,
                    type: item.type,
                    href: item.external_urls.spotify,
                    spotifyId: item.id
            }
        }
    }, []);

    return item.owner ?
    // for playlist tracks view
        <div onClick={() => setFound(selectionParsed)} className={`rounded text-xs mb-2 bg-${color}-500 text-cyan-50 p-1`}>
            <Link to={`/results/${item.id}`}>
                <span onClick={() => getPlaylistTracks(item.id)}>
                    { item.images[0].url && <img src={item.images[0].url} alt='playlist'/> }
                    <p className={`text-cyan-50 text-lg bg-${color}-700 p-1 rounded`}> {item.name} </p>
                </span>
            </Link>
            <div className='p-3' style={{backgroundColor: 'black'}}> 
                <p className='text-xs'> curated by </p>
                {` ${item.owner.display_name}`}
                <br/>
                <a href={`https://open.spotify.com/playlist/${item.id}`}> 
                    <span className='p-3' style={{backgroundColor: 'black'}}>
                        <span className='font-sans font-medium text-md pr-1'> Listen in Spotify </span>
                        <i className='fab fa-spotify pt-4' style={{color: '#1DB954', fontSize: '34px'}}/>
                    </span>
                </a>
            </div>
        </div>
    :
    // for reusability w other views
        <div className={`list-item list-decimal list-inside rounded text-xs mb-2 bg-${color}-500 text-cyan-50 font-semibold text-left p-1`}>
            {item.images?.[0] && <img src={item.images[0].url} alt='playlist'/>}
            {item.album && <img src={item.album.images[0].url || `no image available` } alt='playlist'/> }
            <p className={`text-cyan-50 text-lg text-center font-normal `}> {item.artists && item.artists.map(artist => `${artist.name} -`)} <span className='text-cerise-400'> {item.name} </span> </p>
            { item.album && <p className={`text-xs rounded p-1  text-cyan-50`}> From '{item.album.name}'</p> }
            <p className={`text-xs text-center font-normal text-cerise-100`}> {item.genres && item.genres.map(genre => `${genre} `)} </p>
        </div>
};