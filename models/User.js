const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'username', // Specify the field to use for username (default is 'username')  // Ensure that usernames are always lowercase
  session: false              // Disable sessions as we're using JWTs
});


const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;