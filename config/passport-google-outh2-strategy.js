const passport=require('passport');

//Importing Google OAuth strategy
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;

//importing crypto to set generate a random password 
const crypto=require('crypto');


const User=require('../model/User');

//using google Oauth strategy ---refer Passport.js google OAuth for better understanding
passport.use(new googleStrategy({
        clientID: "985326724668-la40ijjk44nh7218arlib6jjdirokr03.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/user/auth/google/callback",
    },
    async function(accessToken, refreshToken, profile, done){
        try{
            let user=await User.findOne({email: profile.emails[0].value});
            console.log("googe profile---------",profile);
            // console.log("googe userAcc---------",userAcc);
            if(user){
                return done(null,user);
            }else{
                try{
                    //creating the user account if user does not exist in the DB
                     user=await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    });
                    if(user){
                        return done(null,user);
                    }
                }
                catch(err){
                    if(err){
                        console.log("error in creating the user in google Oauth",err);
                        return
                    }
                }
            }
        }
        catch(err){
            if(err){
                console.log("error in google auth startegy",err);
                return
            }
        }

    }


))

