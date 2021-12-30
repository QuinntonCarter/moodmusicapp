import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// from components/context
import { accessToken } from './components/spotify.js';
import { UserContext } from './components/context/userProvider.js';
import { AppContext } from './components/context/appContext.js';
// components
import ProtectedRoute from './components/protectedRoute.js';
import Banner from './components/banner.js';
import Auth from './Auth.js';
import { UserProfile } from './components/userProfile.js';
import { CheckMood } from './components/checkMood.js';
import { Navbar } from './components/navbar.js';
import { ResultsProfile } from './components/resultsProfile.js';
// views
import Lists from './views/lists.js';
import Profile from './views/profile.js';
import { Search } from './views/search.js';

function App() {
  const { token } = useContext(UserContext)
  const { found } = useContext(AppContext)
  console.log(accessToken)
  return (
    <div className='h-screen overflow-scroll text-emerald-50' style={{backgroundColor: 'black'}}>
    <Banner/>
      <Switch>
        <Route
          path='/logout'
          render={Auth}
        />

        <ProtectedRoute
          path='/user/:userID'
          redirectTo='/'
          token={token}
          component={UserProfile}
          loading={false}
        />

        <ProtectedRoute
          path='/results/:location'
          redirectTo='/'
          token={token}
          component={() => found.image ? <ResultsProfile/> : <Redirect to='/check/moods'/> }
          loading={false}
        />

        <ProtectedRoute
          path='/search'
          redirectTo='/'
          token={token}
          component={Search}
          loading={false}
        />

        <ProtectedRoute
          path='/check'
          redirectTo='/'
          token={token}
          component={CheckMood}
          loading={false}
        />

        <ProtectedRoute
          exact path='/lists'
          redirectTo='/'
          token={token}
          spotifyToken={accessToken}
          component={Lists}
          loading={false}
        />

        <Route
          path='/'
          render={() => accessToken && token ?
            <Profile/>
          :
            <Auth/>
          }
        />
      </Switch>
      {  accessToken && token ? <Navbar /> : null }
    </div>
  );
}

export default App;