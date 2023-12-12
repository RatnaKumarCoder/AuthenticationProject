//importing express and accessing the express instance
const express=require('express');
const app=express();

//loading the connection to the db
const db=require('./config/mongoose');

//import the connect-flash library
const flash = require('connect-flash');

//loading the custom flash middle ware
const callFlash=require('./config/flashMiddleware');

//------------used for session cookie and authntication startegy -----------------------//

//importing the cookie-parser to use as a middle ware
const cookiParser=require('cookie-parser');

//importing the express session to set up the session-cookie 
const session=require('express-session');

//importing passport library
const passport=require('passport');

//loading the local passport strategy 
const passportlocal=require('./config/passport-local-strategy');

//loading the Google OAuth passport strategy 
const passportGoogle=require('./config/passport-google-outh2-strategy');

//setting up middleware to parse the data from frontend actions
app.use(express.urlencoded());

//setting up the middleware to parse the session cookie
app.use(cookiParser());

// const layouts=require('express-ejs-layouts');
// app.use(layouts);

//specifying the layouts 
const port=8000;

//middleware to sets up a static file server to serve static files
app.use(express.static('./assets'));

//setting up view engine as ejs
app.set('view engine',"ejs");
//specifying the relative path to our views folder
app.set('views','./views');

//setting up a express-session middleware for our cookie specfying the name, secret and life of the cookie
app.use(session(
    {
        name: 'Authentication',
        //TODO change the secret to deploy in production mode
        secret: "blahsomething",
        saveUninitialized: false,
        resave: false,
        cookie:{
            maxAge:(1000*60*1000)
        }
    }
));

//intitializing the passport as our middleware in express
app.use(passport.initialize());

//middleware which sets up the initialization of passport to use session
app.use(passport.session());

//custome middleware to set the authenticated user data to 'res.locals.user'
app.use(passport.setAuthenticatedUser);

//express.js using flash as middleware
app.use(flash());

// custom middleware to set flash messages to res.locals
app.use(callFlash.setFlash);

// sub-routing the api calls
app.use('/',require('./router'));

//starting the server
app.listen(port,function(err){
    if(err){
        console.log("error starting the server",err);
    }
    console.log("server listening at port 8000"); 
});

