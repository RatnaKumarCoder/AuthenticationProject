
const express=require('express');

// create an instance of the express router
const router=express.Router();

// importing the modularized controller
const signInController=require('../controller/signinController');


const passport=require('passport');

// to display signup page
router.get('/',signInController.signup);

// routing to sign-in page
router.get('/sign-in',signInController.signIn);

// routing to the home page after successful sign-in
router.get('/home',passport.checkAuthentication,signInController.home);

// controller action to create an account for the user
router.post('/user/createUser',signInController.create);

// to navigate to the forgot password page
router.get('/reset_password',signInController.forgotPage);

// sigining out the user
router.get('/sign-out',signInController.destroySession);

// controller action to reset the password for signed-in users
router.post('/user/reset-password',signInController.resetPassword);
// router.post('/user/create-session',signInController.createSession);

// google Oauth 
router.get('/user/auth/google',passport.authenticate('google',{scope:['profile','email']}));

// google Oauth callback router
router.get('/user/auth/google/callback',passport.authenticate('google', {failureRedirect: '/sign-in'}),signInController.createSession);

// controller action to reset the password for the forgot password users
router.post('/forgot_password',signInController.forgotPassword);

// router to creating a session for the user after sign-in
router.post('/user/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/sign-in'},
),signInController.createSession);


// router.post('/password_link');

//router to render the password mail page
router.get('/mail',signInController.password_mail);

//router to check mail to send the password mail link
router.post('/check_mail',signInController.checkMail);

module.exports=router;