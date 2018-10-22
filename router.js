module.exports = function(app){
  app.get('/', function(req, res, next){
    res.send("I'm going to the client");
  })
}
