const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false});
// using jwt strategy, when use is authenticated, dont try to create
// a cookie-based session


module.exports = function(app){
  app.post('/signup', Authentication.signup);
  app.post('/signin', requireSignIn, Authentication.signin);

  app.get('/', requireAuth, function(req, res){
    res.send("Hello client");
  })
}
