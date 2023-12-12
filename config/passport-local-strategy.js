const passport=require('passport');

//importing passport local strategy
const LocalStrategy=require('passport-local').Strategy;

const User=require('../model/User');

//importing bcrypt library to encrypt the password  
const bcrypt=require('bcryptjs');

//new local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
},
//authentication using passport
    async function(email,password,done){
        //find a user and establish the identity
        try{
        const userData=await User.findOne({email:email});
        var passAuth=bcrypt.compareSync(userData.password, password); 
        if(!userData || passAuth){
            console.log('Invalid Username/Password');
            return done(null,false);
        }
        return done(null,userData);
    }
    catch(err){
        if(err){
            console.log('error in finding user-------->passport');
            return done(err);
        }
    }

    }
));


//serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null, user.id);
});

//de-serializing the user from the key in the cookie
passport.deserializeUser(async function(id,done){
    try{
        const user= await User.findById(id);
        return done(null,user);
    }
    catch(err){
        console.log('error in finding the user---->in deserializing');
        return done(err);
    }
});

//check if user is authenticated

passport.checkAuthentication = async function(req,res,next){
    //if user is signed in, then pass on the request to the next controller action
    if(req.isAuthenticated()){
        return next();
    }
    //if not signed in redirect to the signed in page
    return res.redirect('/sign-in');
}

//setting up authenticated user details in res.locals to be accessed by views
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the the locals for the views.
        res.locals.user=req.user;
        console.log(req.user);
    }
    next();
}

module.exports=passport;

