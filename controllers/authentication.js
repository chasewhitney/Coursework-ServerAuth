const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // Subject, Issued At Time
  return jwt.encode({ sub: user.id, iat:timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has had email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({ error: "Missing username or password." })
  }

  // See if user exists
  User.findOne({ email: email}, function(err, existingUser){
    // If it finds a matching user, existingUser will be that User
    // If it didn't find a matching user, existingUser will be null

    // If search error, like no connection to database
    if(err){ return next(err); }

    // If existing user found, return an error
    if(existingUser){
      return res.status(422).send({ error: "Email is in use." });
      // 422: Unprocessable entity. Couldnt process, supplied data is bad
    }

    // If user doesn't, create and save user
    const user = new User({
      email: email,
      password: password
    });
    user.save(function(err){
      if(err){ return next(err); }

      // Respond to request indicating the user was created
      return res.send({ token: tokenForUser(user)});
    });
  });
}
