import axios from 'axios';
const spotifyUserAPI = axios.create();
const { 
  REACT_APP_API_URL,
  REACT_APP_MOOD_SERVER_URL
} = process.env

// declare localStorage keys
export const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp',
}

// retrieve localStorage values
export const LOCALSTORAGE_VALUES = {
    accessToken: localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

/**
 * Clear out all localStorage items we've set and reload the page
 */
export const spotifyLogout = () => {
  localStorage.clear()
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 */
const hasTokenExpired = () => {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
        return false;
    }
    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed / 1000) > Number(expireTime);
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 */
const refreshToken = async () => {
    try {
      // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
        if (!LOCALSTORAGE_VALUES.refreshToken ||
        LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
        (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
        ) {
          console.error('No refresh token available');
          spotifyLogout();
        }

      // Use `/refresh_token` endpoint from our Node app
        const { data } = await axios.get(`${REACT_APP_MOOD_SERVER_URL}refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

      // Update localStorage values
        localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
        localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

      // Reload the page for localStorage updates to be reflected
        window.location.reload();

    } catch(e) {
        console.error(e);
    }
};

const getAccessToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
        [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    };
    const hasError = urlParams.get('error');

    // If there's an error OR the token in localStorage has expired, refresh the token
    if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
        refreshToken();
    }

    // // If there is a valid access token in localStorage, use that
    if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
        return LOCALSTORAGE_VALUES.accessToken;
    }

    // If there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
      // Store the query params in localStorage
        for (const property in queryParams) {
        window.localStorage.setItem(property, queryParams[property]);
        }
      // Set timestamp to keys
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
      // Return access token from query params
        return queryParams[LOCALSTORAGE_KEYS.accessToken];
    }

    return false;
}

export const accessToken = getAccessToken();

spotifyUserAPI.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${accessToken}`
    config.baseURL = REACT_APP_API_URL
    return config
});

export const getCurrentUserProfile = () => spotifyUserAPI.get('/me');