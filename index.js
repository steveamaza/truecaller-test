// server.js

// set up ======================================================================
// get all the tools we need
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const server = app.listen(port);

const mongoose = require('mongoose');
const flash = require('connect-flash');
const tc = require('./config/truecaller');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

const path = require('path');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
mongoose.Promise = global.Promise; // Get Mongoose to use the global promise library
const db = mongoose.connection; // Get default connection

db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Bind connection to error event (to get notification of connection errors)

app.use(express.static(path.join(__dirname, ''))); // for defining static file path

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, tc, server); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

console.log(`The magic happens on port ${port}`);
