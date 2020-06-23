const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport')
;
const {ensureAuth} = require('../config/auth');
// log
router.get('/login', (req, res) => res.render('login'));

router.get('/dashboard',ensureAuth,  (req, res) => res.render('dashboard',{
    name: req.user.name
}));
router.get('/register', (req, res) => res.render('register'));
router.post('/register', (req, res) => {
    const {name,email, password, password2} = req.body;

    let errors = [];
    // check required fields
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'})
    }
    if (password !== password2){
        errors.push({msg: 'Passwords do not match'})
    }
    if (password.length < 8 ){
        errors.push({msg: 'Password should be at least 8 characters'})
    }
    if (errors.length > 0){
        
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
            
        });
        
    }else{
        User.findOne({email: email}).then(user => {
                if (user) {
                    errors.push({msg: 'Email is Already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                        
                    });  
                }else{
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: password
                    });

                    bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        // set password to hash
                        newUser.password = hash;
                        // save User
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'you are now registered and can login')
                                res.redirect('login');
                            })
                            .catch(err => console.log(err))
                    }))

                    console.log(newUser)
                    console.log(errors)
                    // res.send('#BlackLivesMatters')

                }
            })
    }
    console.log(errors)
    
});
// login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});
// logout
router.post('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'you are logged out')
    res.redirect('/users/login')
})

module.exports = router;
