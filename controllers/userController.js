const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship'); 

module.exports.profile = async function (req, res) {

    try {
        let user = await User.findById(req.params.id);

        let populated_user = await User.findById(req.user).populate('friends');

        return res.render('user-profile', {
            title: "User Profile",
            profile_user: user,
             populated_user
        });
    } catch (err) {
        console.log('ERROR IN updating the profile ', err);
        return;
    }
}

module.exports.update = async function(req,res) {
    try {
            if(req.user.id == req.params.id)
            {
                let user = await User.findById(req.params.id);
                User.uploadedAvatar(req, res, function(err){
                    if(err){
                        console.log("MULTER ERROR " , err);
                    }

                    user.name = req.body.name;
                    user.email = req.body.email;
                    if(req.file){
                        if(user.avatar){
                            fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                        }
                        // We are saving the path of the avatar file in the avatar property of user.
                        user.avatar = User.avatarPath + '/' + req.file.filename ;
                    }
                    user.save();
                    console.log(req.file);
                })

                
                req.flash('success' , 'Updated!');
                return res.redirect('back');
            }
            else{
                req.flash('error' , 'Unauthorized!');
                return res.status(401).send('Unauthorised!');
            }
    } catch (error) {
        req.flash('error', 'Error in updating the profile!!');
        console.log('Error in updating the profile!!', error);
    }
}

//Render the signUp Page
module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_up', {
        title: "Lambda | Sign Up"
    })
}

//Render the signIn Page
module.exports.signIn = function (req, res) {
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Lambda| Sign In"
    })
}

//Sign up
module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Password do not match');
            return res.redirect('back');
        }

        let  user = await User.findOne({email: req.body.email});

        if (!user) {
            await User.create(req.body);
            return res.redirect('/users/sign-in');

        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Error detected", err);
    }
}




//Sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success' , 'Logged in Successfully');
    return res.redirect('/');

}

//Destroy the session 
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success' , 'You have logged out!!');
        res.redirect('/');
      });
}
