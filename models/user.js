const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, (pre save), run this:
userSchema.pre('save', function(next){
  // Get access to the user model
  const user = this;

  // Generate a salt
  bcrypt.genSalt(10, function(err, salt){
    if(err){ return next(err); }

    // Hash(encrypt) password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){ return next(err); }

      // Overwrite password with encrypted password.
      user.password = hash;
      next();
    });
  });
});

// Create model class
const ModelClass = mongoose.model('user', userSchema);


// Export model
module.exports = ModelClass;
