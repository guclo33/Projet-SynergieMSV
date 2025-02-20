const express = require('express');
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const {connectCanva, getAuthUrl, getAuthUrlProfile, getUser, connectCanvaDetail, setAuthStatus} = require("./canvaTemplate");
const adminRoute = require("../routes/admin");
const registerRoute = require("../routes/register");
const loginRoute = require("../routes/login")
const leaderRoute = require("../routes/leader")
const userRoute = require("../routes/user")
const formRoute = require("../routes/form")
const cors = require('cors');
require("dotenv").config();
const Redis = require('ioredis');
const connectRedis = require('connect-redis');
const { isAuthenticated, isAuthorizedAdmin, isAuthorizedLeader, isAuthorizedUser } = require('../controller/loginAndRegister');
const passport = require('./config/passport');
const path = require('path');
const cookieParser = require('cookie-parser');




const sessionSecret = process.env.COOKIE_SECRET_KEY

const RedisStore = connectRedis(session);
const redisClient = new Redis(process.env.REDIS_RENDER_URL, {
  tls: {
  rejectUnauthorized: false, 
},})

const allowedOrigins = ['http://10.0.0.6:3001', 'http://localhost:3000', "http://localhost:3001", "https://app-aagr4xe5mic.canva-apps.com", "http://127.0.0.1:3001", "http://localhost:3001/admin", "https://projet-synergiemsv.onrender.com", "projet-synergiemsv:3000" ]; // 

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS')); 
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ["Set-Cookie"], 
};

app.use(cookieParser());
app.set('trust proxy', 1);
app.use(express.json());
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: sessionSecret,  
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24, 
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', }  
}));
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());



redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.set('testKey', 'testValue');
redisClient.get('testKey', (err, result) => {
    console.log('Test key value:', result);
});

app.use("/api/admin/:id", isAuthorizedAdmin, adminRoute)
app.use("/api/leader/:id", isAuthorizedLeader, leaderRoute)
app.use("/api/user/:id", isAuthorizedUser, userRoute)

app.use("/api/form", formRoute)
app.use("/api/register", registerRoute)
app.use("/api/login", loginRoute)

app.get("/api/canva/authurl/", (req,res) => {
  const authURL = getAuthUrl();
  res.json({authURL})
})


app.get("/api/canva/authurl/profile", (req,res) => {
  const authURL = getAuthUrlProfile();
  res.json({authURL})
})

app.get("/api/user/:id", getUser)

app.get("/api/canva/auth", connectCanva)

//app.get("/api/details/canva", connectCanvaDetail);

app.get('/api/auth/check', (req, res) => {
  console.log("req.user:", req.user)
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
   
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send({ message: 'Logout failed' });
    res.status(200).send({ message: 'Logout successful' });
  });
});

app.use(express.static(path.join(__dirname, '../synergiemsv/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../synergiemsv/build', 'index.html'));
});

app.listen(PORT, "0.0.0.0", () =>{
    console.log(`Listening to port : ${PORT}`)
})

