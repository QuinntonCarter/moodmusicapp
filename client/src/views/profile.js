import { useContext, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { RecentTracks } from '../components/recentTracks.js';
import { RecentArtists } from '../components/recentArtists.js';
import { CheckMood } from '../components/checkMood.js';
import { UserContext } from '../components/context/userProvider.js';
import { PostedMood } from '../components/postedMood.js';
import { PostedList } from '../components/postedList.js';

export default function Profile(){
    const {
        getPosts,
        userState,
        getStatus,
        setUserState,
        deleteUserAccount
    } = useContext(UserContext);

    var playlistText = userState.lists ? 'posted playlist' : `you haven't posted a playlist`

    const recentMapped = userState.recentMood && userState.recentMood.map(mood => 
        <>
            <h3 className='text-sm text-indigo-500'> {mood.userString}'s mood
                    {mood.timeline === 'short_term' && ` these past 30 days`}
                    {mood.timeline === 'medium_term' && ` these past 6 months`}
                    {mood.timeline === 'long_term' && ` the past year`} 
                </h3>
            <PostedMood 
                key={mood._id}
                id={mood._id}
                items={mood.items}
                />
        </>
    );

    const recentPlaylist = userState.lists && userState.lists.map(list => 
        <>
            <PostedList
                list={list}
                key={list._id}
            />
        </>
        )

    useEffect(() => {
        getStatus('user')
        .then(res => setUserState(prevState => ({
                ...prevState,
                recentMood: res
            }))
        )
        getPosts('user')
        .then(res => setUserState(prevState => ({
            ...prevState,
            lists: res
        })))
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <div className='container-main'>
                <span className='text-sm m-1 p-1' > set <span className='text-indigo-300'> mood </span> or view more detailed stats  </span>
                <Link to={'/check/moods'}>
                    <input className='bg-indigo-300 text-cyan-800 btn' type='button' value='mood view'/>
                </Link>
                {recentMapped}
                <p style={{color: 'gray'}} className='text-sm m-1'> {playlistText} </p>
                {recentPlaylist}
                <h1 className='text-sm m-1 p-1' style={{color: 'gray'}}> click to view past month top </h1>
                <Link to={`/recent_mood_artists`}> 
                    <input className='bg-cyan-200 text-cyan-800 btn' type='button' value='artists'/>
                </Link>
                <Link to={`/recent_mood_tracks`}> 
                    <input className='bg-cyan-200 text-cyan-800 btn' type='button' value='tracks'/>
                </Link>
                <Switch>
                    <Route
                        path={`/check/moods`}
                        render={() => 
                            <CheckMood/>
                    }>
                    </Route>
                    <Route 
                        path={`/recent_mood_artists`}
                        render={() => 
                            <RecentArtists/>
                    }>
                    </Route>
                    <Route
                        path={`/recent_mood_tracks`}
                        render={() => 
                            <RecentTracks/>
                    }>
                    </Route>
                </Switch>
                <button className='btnbold-small bg-cerise-900' onClick={deleteUserAccount}> delete profile </button>
        </div>
    )
};