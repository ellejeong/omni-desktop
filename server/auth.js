const app = require('APP'), {env} = app
const debug = require('debug')(`${app.name}:auth`)
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('APP/db/models/user')
const OAuth = require('APP/db/models/oauth')
const auth = require('express').Router()


/*************************
 * Auth strategies
 *
 * The OAuth model knows how to configure Passport middleware.
 * To enable an auth strategy, ensure that the appropriate
 * environment variables are set.
 *
 * You can do it on the command line:
 *
 *   FACEBOOK_CLIENT_ID=abcd FACEBOOK_CLIENT_SECRET=1234 npm start
 *
 * Or, better, you can create a ~/.$your_app_name.env.json file in
 * your home directory, and set them in there:
 *
 * {
 *   FACEBOOK_CLIENT_ID: 'abcd',
 *   FACEBOOK_CLIENT_SECRET: '1234',
 * }
 *
 * Concentrating your secrets this way will make it less likely that you
 * accidentally push them to Github, for example.
 *
 * When you deploy to production, you'll need to set up these environment
 * variables with your hosting provider.
 **/

// Facebook needs the FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET
// environment variables.
OAuth.setupStrategy({
  provider: 'facebook',
  strategy: require('passport-facebook').Strategy,
  config: {
    clientID: env.FACEBOOK_CLIENT_ID,
    clientSecret: env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/facebook`,
  },
  passport
})

// Google needs the GOOGLE_CLIENT_SECRET AND GOOGLE_CLIENT_ID
// environment variables.
OAuth.setupStrategy({
  provider: 'google',
  strategy: require('passport-google-oauth').OAuth2Strategy,
  config: {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/google`,
  },
  passport
})

// Github needs the GITHUB_CLIENT_ID AND GITHUB_CLIENT_SECRET
// environment variables.
OAuth.setupStrategy({
  provider: 'github',
  strategy: require('passport-github2').Strategy,
  config: {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `${app.baseUrl}/api/auth/login/github`,
  },
  passport
})

// Other passport configuration:
// Passport review in the Week 6 Concept Review:
// https://docs.google.com/document/d/1MHS7DzzXKZvR6MkL8VWdCxohFJHGgdms71XNLIET52Q/edit?usp=sharing
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(
  (id, done) => {
    debug('will deserialize user.id=%d', id)
    User.findById(id)
      .then(user => {
        if (!user) debug('deserialize retrieved null user for id=%d', id)
        else debug('deserialize did ok user.id=%d', id)
        done(null, user)
      })
      .catch(err => {
        debug('deserialize did fail err=%s', err)
        done(err)
      })
  }
)

// require.('passport-local').Strategy => a function we can use as a constructor, that takes in a callback
passport.use(new (require('passport-local').Strategy) (
  (email, password, done) => {
    debug('will authenticate user(email: "%s")', email)
    User.findOne({where: {email}})
      .then(user => {
        if (!user) {
          debug('authenticate user(email: "%s") did fail: no such user', email)
          return done(null, false, { message: 'Email incorrect!' })
        }
        return user.authenticate(password)
          .then(ok => {
            if (!ok) {
              debug('authenticate user(email: "%s") did fail: bad password')
              return done(null, false, { message: 'Password incorrect!' })
            }
            debug('authenticate user(email: "%s") did ok: user.id=%d', email, user.id)
            done(null, user)
          })
      })
      .catch(done)
  }
))
//desktop app - checks authenticated or not
auth.get('/whoami', (req, res) => {
  const flash = req.flash('error')[0]
  const response = {user: req.user || "", flash: flash || ""}
  res.send(response)
})

//mobile app - checks validity of token
auth.get('/verify', (req, res, next) => {
  //checks validity of token, sets req.user if token is valid
  const token = req.query.token
  if(token){
    //token found
    jwt.verify(token, env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.send({success: false, error: 'Failed to verify token'});
      } else {
        // if everything is good, find user, save to req.user for use in other routes, send user info to app
        User.findById(decoded.id)
          .then(user => {
            req.user = user;
            //send updated user to app
            const savedUser = {
              name: user.name,
              email: user.email,
              id: user.id,
              photoUrl: user.photoUrl,
              sleepDebt: user.sleepDebt,
              averageSleep: user.averageSleep,
            }
            res.send({success: true, user: savedUser})
          }).catch(next)
      }
    });
  } else {
    res.send({success: false, error: 'No token'})
  }
})

// POST requests for local login:
auth.post('/login/local', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }))

//POST request for mobile authentication which does not user sessions.
//Generates a JWT to be stored on the app and authenticate future requests.
auth.post('/login/mobile', (req, res, next) => {
  const email = req.body.username
  const password = req.body.password
  //find user
   User.findOne({where: {email}})
    .then(user => {
      if (!user) {
        return res.status(401).send('Login incorrect')
      }
      //check password
      return user.authenticate(password)
        .then(ok => {
          if (!ok) {
            return res.status(401).send('Login incorrect')
          }
          //once user is authenticated, issue a token.
          const token = jwt.sign({id:user.id}, env.JWT_SECRET, {
            expiresIn: "30d" // expires in 30 days
          });
          //send token
          res.send(token)
        })
    })
    .catch(next)
})

// GET requests for OAuth login:
// Register this route as a callback URL with OAuth provider
auth.get('/login/:strategy', (req, res, next) =>
  passport.authenticate(req.params.strategy, {
    scope: 'email',
    successRedirect: '/',
    // Specify other config here, such as "scope"
  })(req, res, next)
)

auth.post('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/api/auth/whoami')
})

module.exports = auth

