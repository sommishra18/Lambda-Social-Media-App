const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//Aunthenticate using Passport JS

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
   async function(req,email,password,done){
        //Find a user and establish the identity
        try {
            let user = await User.findOne({email: email});

            if(!user || user.password != password)
            {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

                return done(null , user);

        } catch (err) {
            if(err){
                req.flash('error', 'Error!!!');
                return done(err);
            }
        }
    }
))


//Serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null , user.id);
})



//deserializing the user from the key in the cookies

passport.deserializeUser(async function(id,done){

    try {
        let user = await User.findById(id);
        return done(null, user);

    } catch (err) {
        if(err){
            console.log('Error in finding the user! -> Passport');
            return done(err);
        }
    }

});

//Check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in then pass on the request to the next function (controller's action)
            if(req.isAuthenticated())
            {
                return next();
            }
            
            return res.redirect('/users/sign-in');
    }
    
    passport.setAuthenticatedUser = function(req, res, next){
        if(req.isAuthenticated())
        {
            //req user contains the current signed in user from the session cookie and 
            // we are sending this to the locals for the views
            res.locals.user = req.user;
         }

         next();
    }
module.exports = passport;