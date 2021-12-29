export default function AuthForm(props){
    const {
        handleChange,
        handleSubmit,
        btnText,
        errMsg,
        inputs: {
            username,
            password
        }
    } = props

    return(
    <form className='text-indigo-900' onSubmit={handleSubmit}>
        <input className='m-3 p-1'
            value={username}
            name='username'
            onChange={handleChange}
            placeholder='username'
        />
        <input
            className='m-3 p-1'
            type='password'
            value={password}
            name='password'
            onChange={handleChange}
            placeholder='password'
        />
        <button className='bg-indigo-400 text-cyan-800 rounded p-1 m-3 text-md'> {btnText} </button>
        <p className='text-cerise-700 text-center font-medium'> {errMsg} </p>
    </form>
    )
};