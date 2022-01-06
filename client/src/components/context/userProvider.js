import React, { useState } from 'react';
import axios from 'axios';

const {
    REACT_APP_MOOD_SERVER_URL
} = process.env

export const UserContext = React.createContext();

const userAxios = axios.create();
userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    config.baseURL = REACT_APP_MOOD_SERVER_URL
    return config
});

export default function UserProvider(props){
    const initState = {
        // user: JSON.parse(localStorage.getItem('user')) || null,
        user: {},
        token: localStorage.getItem('token') || '',
        lists: [],
        recentMood: [],
        // use to fix friend list info display on follow/unfollow **
        friends: [],
        friendLists: [],
        friendPosts: [],
        errMsg: ''
    };

    const initSpotifyState = {
        spotifyUser: JSON.parse(localStorage.getItem('spotifyUser')) || null,
        spotifyToken: localStorage.getItem('spotify_access_token') || '',
        errMsg: ''
    };

    const [ spotifyUserState, setSpotifyUserState ] = useState(initSpotifyState);
    const [ userState, setUserState ] = useState(initState);

// for auth
    function signup(credentials){
        axios.post(`/auth/signup`, credentials, {
            baseURL:  REACT_APP_MOOD_SERVER_URL
        })
        .then(res => {
            const { user, token } = res.data
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch(err => handleAuthError(err.response.data.errMsg))
    };

    function login(credentials){
        const parsedInputs = {
            username: credentials.username.split(' ').join('_'),
            password: credentials.password
        }
        axios.post(`/auth/login`, parsedInputs, {
            baseURL: REACT_APP_MOOD_SERVER_URL
        })
        .then(res => {
            const { user, token } = res.data
            localStorage.setItem('token', token)
            // localStorage.setItem('user', JSON.stringify(user))
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
            }))
        })
        .catch(err => 
            handleAuthError(err.response.data.errMsg)
        )
    };

    function logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUserState({
            user: {},
            token: '',
        });
    };

//  err
    function handleAuthError(err){
        setUserState(prevState => ({
            ...prevState,
            errMsg: err
        }))
    };

    function resetAuthError(){
        setUserState(prevState => ({
            ...prevState,
            errMsg: ''
        }))
    };

// POST share posts depending on type
    const shareItem = (list, timeframe) => {
        if(list.type === 'playlist'){
            userAxios.post(`/app/lists`, list, {
                params: {
                    time: timeframe
                }
            })
            .then((res) => setUserState(prevState => ({...prevState, lists: [res.data]})))
            .catch(err => console.log(err))
        } else {
            userAxios.post(`/app/moods/${timeframe}`, list)
            .then((res) => setUserState(prevState => ({...prevState, recentMood: [res.data]})))
            .catch(err => console.log(err))
        }
    };

// PUT follow and unfollow
    const updateFollowStatus = async (id, type) => {
        const { data } = await userAxios.post(`/app/users/friends`, {
            params: {
                type: type,
                id: id
            }
        })
        setUserState(prevState => ({
            ...prevState,
            user: data
        }))
    };

// GET mood from DB **
    const getStatus = async (type, searched) => {
        let resp
        if(type === 'user'){
            const { data } = await userAxios.get(`/app/moods`, {
                params: {
                    type: type
                }
            })
            return resp = data
        } else if(type === 'friends'){
            const { data } = await userAxios.get(`/app/moods`, {
                params: {
                    type: type
                }
            })
        return resp = data
        } else if(type === 'searched'){
            const { data } = await userAxios.get(`/app/moods`, {
                params: {
                    type: type,
                    searched: searched
                }
            })
            return resp = data
        }
    return resp
    };

// GET recent playlist
    const getPosts = async (type) => {
        if(type === 'user'){
        const { data } = await userAxios.get(`/app/lists`, {
            params: {
                type: type,
            }
        })
        return data
    } else if(type === 'friends'){
        const { data } = await userAxios.get(`/app/lists`, {
            params: {
                type: type
            }
        })
        return data
    }};

    // DELETE account and logout
    const deleteUserAccount = () => {
        userAxios.delete(`/app/users/removeAcc`)
        .then(res => console.log(res.data))
        .catch(err => handleAuthError(err.response.data.errMsg))
        setTimeout(() => { logout() }, 1000)
    };

    return(
        <UserContext.Provider
        value={{
            ...userState,
            setUserState,
            spotifyUserState,
            setSpotifyUserState,
            userState,
            signup,
            login,
            logout,
            userAxios,
            deleteUserAccount,
            shareItem,
            updateFollowStatus,
            getStatus,
            getPosts,
            resetAuthError
        }}>
            {props.children}
        </UserContext.Provider>
    )
};