const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email}, function(err, user){
    if(err) { return done(err); };
    if(!user) { return done(null, false); };

    // Compare passwords - is 'password' === user.password
    user.comparePasswords(password, function(err, isMatch){
      if(err) { return done(err); }
      if(!isMatch) { return done(null, false);}

      return done(null, user);

    });
  });



});
// tell it where to look in req to get access to email and password
// looks for "username" and "password" by default, options says look for
// username at the "email" property of the request instead
// so after the local strategy parses the request, it pulls out the email
// and the password and hands it to us in the callback. Then verify.



// Setup options for JWT JwtStrategy
const jwtOptions = {
  jwtFromRequest : ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // See if the user ID in the payload exists in our db
  // If so, call 'done' with that user
  // If not, call 'done' without user object
  User.findById(payload.sub, function(err, user){
    if(err) { return done(err, false); } // return err, false for user object

    if(user) {
      done(null, user);
    }
    else {
      done(null, false);
    }

  });

});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
