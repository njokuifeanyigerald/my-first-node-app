const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash =  require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
require('./config/passport/passport')(passport)
// DB config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser:true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs');

// bodyParser
app.use(bodyParser.urlencoded({extended:false}))

// express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

//   passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// route
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`server started on port ${PORT}`));

