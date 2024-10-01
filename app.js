// app.js
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { connect } = require('./Database_mongoose.js');
const authMiddleware = require('./middleware/auth');
const accountController = require('./controllers/accountController');
const uploadRoute = require('./routes/upload1');
const adminRoute = require('./routes/admin');
const appInsights = require('applicationinsights');
const User = require('./models/user.js');
const retrieveRoute = require('./routes/retrieve');;
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: 'https://sibidashboard2.azurewebsites.net/api', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(express.json());
app.use(cors(corsOptions));

appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectConsole(true)
    .start();

// Initialize authentication middleware
authMiddleware();

// Connect to MongoDB
connect()
  .then((connectedClient) => {
    client = connectedClient;
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the application if the database connection fails
  });

// Passport initialization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
app.use(passport.initialize());

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => { res.send('Introduction JWT Auth') });
app.get('/api/profile', passport.authenticate('jwt', { session: false }), accountController.profile);
app.post('/api/login', passport.authenticate('local', { session: false }), accountController.login);
app.post('/api/register', accountController.register);
app.use('/api', uploadRoute); // Mount the upload route
app.use('/api/admin', adminRoute); // Mount the admin route

const telemetryClient = appInsights.defaultClient;

telemetryClient.trackEvent({ name: "AppStarted" });
console.log("App Insights Connection String:", process.env.APPINSIGHTS_CONNECTION_STRING);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
