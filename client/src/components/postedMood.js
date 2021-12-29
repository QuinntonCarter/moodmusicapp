export const PostedMood = props => {
    const {
        items
    } = props

    const mappedItem = items && items.map((item, i) => 
        <figure className={`flex-1 text-auto`}>
            <figcaption className='text-cerise-500 m-1'> {item.selectionName} </figcaption>
            <img src={item.image} alt={item.id}/>
        </figure>
    )

    return(
        <div className='flex flex-wrap border-solid border-2 border-indigo-500 p-2 mb-3'>
            {mappedItem}
        </div>
    )
};