export const PostedList = props => {
    const {
        list
    } = props

    return(
        <div className='border-solid border-2 border-cerise-600 pb-3 grid justify-items-stretch mt-3 mb-3'>
            <p className='text-sm p-3 text-indigo-500'> {list.userString && `mood user: ${list.userString}`} </p>
            <a className='text-sm pr-3 justify-self-end' href={list.ownerProfile} title='open user in Spotify'> <i className='fab fa-spotify p-2' style={{color: '#1DB954', fontSize: '27px'}}/> <span className='text-sm font-sans'> Spotify poster </span>: {list.owner}</a>
            <p className='text-cerise-400 p-3'>{list.name}</p>
            <a href={list.href} title='open playlist in Spotify'>
                <img src={list.image} alt={list.name}/>
                <a href={list.href}> 
                    <span className='p-3' style={{backgroundColor: 'black'}}>
                        <span className='font-sans font-medium text-md pr-1'> Listen in Spotify </span>
                        <i className='fab fa-spotify pt-4' style={{color: '#1DB954', fontSize: '21px'}}/>
                    </span>
                </a>
            </a>
        </div>
    )
};