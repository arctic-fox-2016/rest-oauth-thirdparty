let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
let helper = require('../helper/function.js')
let Users = require('../models/user.js')
let bodyParser = require('body-parser')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let app = express()

router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function(req, res) {
  mongoose.model('users').find(function(err, result) {
    res.send(result)
  })
})

router.get('/register', function(req, res) {
  res.render('register.ejs')
})

router.post('/register', function(req, res) {
  helper.hashPassword(req.body.password, function(hash){
    let newuser = new Users({ email: req.body.email, password: hash });
    newuser.save(function(err,result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.redirect('/login')
      }
    })
  })

})

router.get('/login', function(req, res) {
  res.render('login.ejs')
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'}, function(email, password, done) {
    Users.findOne({ email: email }, function(err, user) {
      if (err) {
        return done(err)
      }

      if (!user) {
        console.log("incorrect username")
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        console.log(user);
        helper.comparePassword(password, user.password, function(err, isMatch) {
          if (isMatch) {
            console.log('betul username and password')
            return done(null, user)
          } else {
            console.log('salah password')
            return done(null, false, { message: 'Invalid password' })
          }
        })
      }
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }), function(req, res, next) {
  res.redirect('/')
});

router.get('/dashboard', function(req,res){
  res.render('dashboard.ejs', {user: req.user})
})

router.post('/logout', function(req,res){
  req.logout()
  res.redirect('/login')
})

module.exports = router
