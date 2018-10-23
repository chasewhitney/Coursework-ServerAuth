const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
// using jwt strategy, when use is authenticated, dont try to create
// a cookie-based session


module.exports = function(app){
  app.post('/signup', Authentication.signup);

  app.get('/', requireAuth, function(req, res){
    res.send("Hello client");
  })
}
