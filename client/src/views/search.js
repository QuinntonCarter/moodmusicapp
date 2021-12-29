import { SearchBar } from '../components/forms/searchBar.js';
import { ResultComp } from '../components/resultComp.js';

export const Search = () => {
    return(
        <div className='container-main grid grid-cols-1 text-center'>
            <SearchBar/>
            <ResultComp/>
        </div>
    )
}