import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from './context/appContext.js';
import { UserContext } from './context/userProvider.js';
// view user set mood/stats

export const UserProfile = () => {
    const {
        selectedItem
    } = useContext(AppContext);

    const {
        updateFollowStatus,
        userState: { user },
        getStatus
    } = useContext(UserContext);

    const history = useHistory();
    const followStatus = user.friends && user.friends.includes(selectedItem._id) ? 'unfollow' : 'follow';
    
    console.log(selectedItem)
    useEffect(() => {
        getStatus('searched', selectedItem._id)
    }, [])

    return(
        <div className='container-main'>
            <button onClick={() => history.goBack()}
                className='bg-cerise-700 text-cyan-50 text-sm font-bold btnbold-small'
            > go back </button>
            <h1 className='text-cyan-50'> {user._id !== selectedItem._id ? `@${selectedItem.username}` : `It's you @${selectedItem.username}`}  </h1>
            <h3 className='text-indigo-300'> {selectedItem.memberSince && `member since ${selectedItem.memberSince.slice(0,10)}`}  </h3>
            {user._id !== selectedItem._id && <button className='btn bg-blue-300' onClick={() => updateFollowStatus(selectedItem._id, followStatus)}> {followStatus} </button>}
        </div>
    )
};