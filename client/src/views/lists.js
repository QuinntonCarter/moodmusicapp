import { useContext, useEffect } from 'react';
import { UserContext } from '../components/context/userProvider.js';
import { PostedMood } from '../components/postedMood.js';
import { PostedList } from '../components/postedList.js';

// friends' posts
export default function Lists(){
    const {
        getPosts,
        getStatus,
        setUserState,
        userState,
        userState: {
            friendPosts
        },
        userState: {
            friendLists
        },
        friends
    } = useContext(UserContext);
    
    const mappedFriendsMoods = friendPosts?.[0] ? friendPosts.map(post => 
        <>
            <h3 className='text-sm text-indigo-500'> {post.userString}'s mood
                {post.timeline === 'short_term' && ` these past 30 days`}
                {post.timeline === 'medium_term' && ` these past 6 months`}
                {post.timeline === 'long_term' && ` the past year`} 
            </h3>
            <PostedMood
                key={post._id}
                id={post._id}
                items={post.items}
            />
        </>
        )
        :
        <>
            <span className='text-sm text-cerise-500'> nothing to display </span>
        </>

    const mappedFriendLists = friendLists?.[0]  ? friendLists.map(list => 
        <PostedList
            list={list}
            key={list._id}
        />)
        :
        <>
            <span className='text-sm text-cerise-500'> nothing to display </span>
        </>

    useEffect(() => {
        getStatus('friends')
        .then(res => setUserState(prevState => ({
                ...prevState,
                friendPosts: res
            }))
        )
        getPosts('friends')
        .then(res => setUserState(prevState => ({
            ...prevState,
            friendLists: res
        })))
    }, [friends]); // eslint-disable-line react-hooks/exhaustive-deps
    console.log(friends)
    console.log(friendLists)
    console.log(friendPosts)

    return(
        <div className='container-main'>
            <div>
            <span className='text-sm text-indigo-300'> {userState.user.friends && userState.user.friends.length} friends and {friendPosts && friendPosts.length} posted moods </span>
                <br/>
                {mappedFriendsMoods}
            </div>
            <div className='pt-3'>
                <span className='text-sm text text-submarine-300'> {userState.user.friends && userState.user.friends.length} friends and {friendLists && friendLists.length} posted lists </span>
                <br/>
                {mappedFriendLists}
            </div>
        </div>
    )
};