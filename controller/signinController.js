//importing user schema model
const User=require('../model/User');

//importing bcryptjs library to encrypt the password before storing in DB
const bcrypt=require('bcryptjs');

//importing configured mailer to mail the password link to the user
const Mailer=require('../mailer/passwordMailer');

//to render the signIn page
module.exports.signIn=function(req,res){
    return res.render("signin",{
        title: "Application signin"
    });
}

//to render the SignUp page
module.exports.signup=function(req,res){
    return res.render('signup',{
        title: "Application signup"
    });
}

//to create a user account and saving the encrytpted password in DB
module.exports.create=async function(req,res){  

    try{
        if(req.body.password!=req.body.confirm_password){
            req.flash('error','Password check failed');
            return res.redirect('/');
        }
        const userExist=User.findOne({email: req.body.email});
        if(userExist==null){
            req.flash('error','account already exists ');
            return res.redirect('/');
        }
        else{
            const salt=await bcrypt.genSalt(10);
            const secpass=await bcrypt.hash(req.body.password,salt);

            const userCreated=await User.create({
                email: req.body.email,
                name: req.body.firstname,
                password: secpass
            });
            console.log(userCreated);
            req.flash('success','Account created successfully ');
            return res.redirect('/sign-in');
        }    
    }
    catch(err){
        if(err){
            console.log('error in signing up user');
            return;
        }
    }

    return res.redirect('/');
}

//creating a session for the user after successfull signIn
module.exports.createSession=async function(req,res){
    
    try{
        //finding the user
        const loginUser=await User.findOne({email: req.body.email});
        
        if(loginUser){
            //handle password which dont match
            var passAuth=bcrypt.compareSync(req.body.password, loginUser.password); 

            if(!passAuth){
                req.flash('error','cannot sign-in');
                return res.redirect('back');
            }
        }
            //handle session creation
            console.log('password authentication successfull');
            req.flash('success','Signed In successfully');
            return res.redirect('/home');
    }
    catch(err){
        if(err){
            console.log('error creating a session for the user', err);
            return;
        }
    }
}

//rendering the homePage after User SignIn
module.exports.home=async function(req,res){
    return res.render("home",{
        title: "HomePage"
    })
}

//signing out user 
module.exports.destroySession=function(req,res){
    req.logout(function(err){
        if(err){
            console.log("error in sigining out-----",err);
        }
        req.flash('success','signed out successfully ');
        return res.redirect('/sign-in');
    });
    
}

//reseting the password from the homepage
module.exports.resetPassword=async function(req,res){
    const loginUser=await User.findById(req.body.userId);
    var passAuth=bcrypt.compareSync(req.body.password, loginUser.password);
    if(!loginUser || !passAuth || req.body.new_password!=req.body.confirm_password){
        req.flash('error','Something is wrong try again');
        console.log("either user not found or password is wrong");
        return res.redirect('/');
    }
    console.log(loginUser.password,"old password");
    const salt=await bcrypt.genSalt(10);
    const secpass=await bcrypt.hash(req.body.new_password,salt);
    loginUser.password=secpass;
    loginUser.save();
    req.flash('success','password changed successfully ');
    console.log("password saved successfully");
    return res.redirect('/sign-in');
}

//rendering the forgotPassword where the user will get the link through mail
module.exports.forgotPage=async function(req,res){
    return res.render('forgotPassword',{
        title: "Reset Password"
    })
}

//controller action to reset the password from forgot password link
module.exports.forgotPassword= async function(req,res){
    const loginUser=await User.findOne({email: req.body.email});
    if(!loginUser){
        req.flash('error','Re-enter email');
        console.log("either user not found or email is wrong");
        return res.redirect('/');
    }
    const salt=await bcrypt.genSalt(10);
    const secpass=await bcrypt.hash(req.body.new_password,salt);
    loginUser.password=secpass;
    loginUser.save();
    console.log("password reset successfully");
    req.flash('success','password reset successfully ');
    return res.redirect('/sign-in');
}

//rendering the page where the user email is authenticated when clicked on forgot password
module.exports.password_mail=async function(req,res){
    return res.render("password_email",{
        title: "Check Mail"
    });

}

//setting the new password where the user changed it from password mail link we sent
module.exports.checkMail=async function(req,res){
    const loginUser=await User.findOne({email: req.body.email});
    if(!loginUser){
        console.log("either user not found or email is wrong");
        req.flash('error', "Please enter correct email");
        return res.redirect('back');
    }
    req.flash('success','password mail has been sent ');
    Mailer.newPassword(loginUser);
    return res.redirect('back');
}