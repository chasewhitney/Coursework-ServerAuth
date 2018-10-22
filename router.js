const Authentication = require('./controllers/authentication');

module.exports = function(app){
  app.post('/signup', Authentication.signup);

  app.get('/', function(req, res, next){
    res.send("Hello client");
  })
}
