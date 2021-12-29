import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { accessToken } from '../spotify.js';
import { UserContext } from './userProvider.js';

const {
    REACT_APP_API_URL,
    REACT_APP_MOOD_SERVER_URL
} = process.env

export const AppContext = React.createContext();

export default function AppContextProvider(props){
    const spotifyUserAPI = axios.create();
    spotifyUserAPI.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${accessToken}`
        config.baseURL = REACT_APP_API_URL
        return config
    });

    const {
        userAxios
    } = useContext(UserContext);

    const [ monthlyArtists, setMonthlyArtists ] = useState({});
    const [ monthlyTracks, setMonthlyTracks ] = useState({});
    const [ found, setFound ] = useState([]);

    const [ playlists, setPlaylists ] = useState({ items:[], total: 0});
    const [ playlistTracks, setPlaylistTracks ] = useState([]);
    const [ selectedItem, setSelectedItem ] = useState({});

    const search = (inputs) => {
        const parseInputs = inputs.split(' ').join('_')
        userAxios.get(`${REACT_APP_MOOD_SERVER_URL}/app/users`, {
            params: {
                inputs: parseInputs,
                type: 'friend'
            }
        })
        .then(res => setFound(res.data))
        .catch(err => console.log(err))
    };

    const getSelection = (id, location) => {
        setFound()
        userAxios.get(`${REACT_APP_MOOD_SERVER_URL}/app/users`, {
            params: {
                id: id,
                type: location
            }
        })
        .then(res => setSelectedItem(res.data))
        .catch(err => console.log(err))
    };

    const getCurrentUserTop = async (type, limit, time_range) => {
            const { data } = await spotifyUserAPI.get(`/me/top/${type}`, {
            params: {
                limit: limit,
                time_range: time_range
            }
        })
            return data
    };

    const getPlaylists = async (id) => {
        const { data } = await spotifyUserAPI.get(`/users/${id}/playlists`, {
            params: {
                limit: 50
            }
        })
        // filter out spotify owned
        const collected = data.items.filter(item => item.owner.display_name !== 'Spotify');
        return collected
    };

    // for finding overall playlist analysis data; id = playlistId **
    const getPlaylistTracks = async (id) => {
        const { data } = await spotifyUserAPI.get(`/playlists/${id}/tracks`)
        setPlaylistTracks(data)
    };

    useEffect(() => {
        getCurrentUserTop('artists', 5, 'short_term')
        .then(res => setMonthlyArtists(res))
        .catch(err => console.log(err))
        getCurrentUserTop('tracks', 5, 'short_term')
        .then(res => setMonthlyTracks(res))
        .catch(err => console.log(err))
    }, []);

    return(
        <AppContext.Provider
        value={{
            monthlyArtists,
            monthlyTracks,
            spotifyUserAPI,
            search,
            found,
            setFound,
            selectedItem,
            getSelection,
            getPlaylists,
            playlists,
            setPlaylists,
            getPlaylistTracks,
            playlistTracks,
            getCurrentUserTop
        }}>
            {props.children}
        </AppContext.Provider>
    )
};