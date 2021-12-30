const express = require("express");
const app = express();
const morgan = require("morgan");
const axios = require("axios");
require("dotenv").config();
const expressJwt = require("express-jwt");
const { URLSearchParams } = require("url");
const mongoose = require("mongoose");

const {
  PORT,
  BASE_URL,
  TOKEN_URL,
  JWT_SECRET,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  MONGODB_URI
} = process.env

app.use(morgan("dev"));
app.use(express.json());

// const generateRandomString = (length) => {
//   let string = "";
//   const possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < length; i++) {
//     string += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return string;
// };

// const scopes = [
//   "user-read-playback-position",
//   "user-read-playback-state",
//   "user-read-currently-playing",
//   "user-read-recently-played",
//   "user-read-email",
//   "user-library-read",
//   "user-top-read",
//   "playlist-read-collaborative",
//   "playlist-read-private",
//   "user-follow-read",
// ];

mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("Connected to the DB")
);

app.get("/", (req, res) => {
  res.send("Hello world, I'm a server! ♪ ♬ (づ￣ ³￣)づ ♬ ♪");
});

app.use("/auth", require("./routes/authRouter.js"));
app.use("/app", expressJwt({
    secret: JWT_SECRET,
    algorithms: ["sha1", "RS256", "HS256"],
  })
);

app.use("/app/users", require("./routes/userRouter.js"));
app.use("/app/moods", require("./routes/moodRouter.js"));
app.use("/app/lists", require("./routes/listsRouter.js"));

// app.get(`/login`, (req, res, next) => {
//   const state = generateRandomString(16);

//   res.cookie("spotify_auth_state", state, {
//     expires: new Date(Date.now() + 3600),
//     secure: true,
//     httpOnly: true,
//   });
//   // https://accounts.spotify.com/authorize&client_id=41305753399c4bb1b8bc94072ff3baed&redirect_uri=https://moodmusicapp.netlify.app/callback&state=
//   const queryParams = new URLSearchParams(
//     `client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scopes}`
//   );

//   res.redirect(`${AUTHENDPOINT}?${queryParams}`);
// });

app.get(`/callback`, (req, res, next) => {
  const code = req.query.code || null;
  const grant = "authorization_code";

    axios({
    method: "POST",
    url: TOKEN_URL,
    params: {
      grant_type: grant,
      code: code,
      redirect_uri: REDIRECT_URI
    },
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
    },
    })
    .then((response) => {
        if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;
        const tokenParams = new URLSearchParams(
            `access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`
        );
        res.redirect(`${BASE_URL}${tokenParams}`)
        } else {
        res.redirect(`/?${URLSearchParams({ error: "Invalid token" })}`);
        }
    })
    .catch((error) => {
        res.send(error);
    });
});

app.get(`/refresh_token`, (req, res) => {
  const { refresh_token } = req.query;
  const queryParams = new URLSearchParams(
    `grant_type=refresh_token&refresh_token=${refresh_token}`
  );

  axios({
    method: "POST",
    url: TOKEN_URL,
    data: queryParams,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      res.send(error);
    });
});

app.use((err, req, res, next) => {
  if(err.name === "UnauthorizedError"){
      res.status(err.status)
  }
  return res.send({ errMsg: err.message })
});

// ** create logout enpoint that removes cookies and sends user back to login page
app.listen(PORT, 8888, () => {
  console.log(`Music app listening at ${PORT}`);
});