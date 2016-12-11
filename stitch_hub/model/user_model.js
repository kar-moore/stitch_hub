var mongoose = require('mongoose');
// things we can easily validate with this package: https://www.npmjs.com/package/mongoose-validators
// can validate one or multiple things
// to validate multiple fields, put in a list

// single validator like this:
// var Schema = new mongoose.Schema({
//     email: {type: String, validate: validators.isEmail()}
// });

// multiple validators like this:
// var Schema = new mongoose.Schema({
//     username: {type: String, validate: [validators.isAlphanumeric(), validators.isLength(2, 60)]}
// });

var validators = require('mongoose-validators');
var Charts = require('./chart_model.js');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  dob: {type: Date, validate: [validators.isDate()]},
  email: {type: String, validate: validators.isEmail()},
  following: [{type: ObjectId, ref: "User"}]
});

/**
 *
 * @param userId
 * @param callback
 */
userSchema.statics.getUserById = function (userId, callback) {
  Users.findOne({
    _id: userId
  }, function (err, user) {
    callback(err, user)
  })
};

/**
 *
 * @param currentUser
 * @param userToFollow
 * @param callback
 */
userSchema.statics.followUser = function (currentUser, userToFollow, callback) {
  Users.findOneAndUpdate(
    {_id: userToFollow},
    {$addToSet: {following: currentUser}},
    function (err, user) {
      callback(err, user)
    })
};

/**
 *
 * @param userId
 * @param callback
 */
userSchema.statics.getFollowersCharts = function (userId, callback) {
  Users.getUserById(userId, function(err,user) {
    if (err) {
      console.log('There was an error!' + err);
      res.send({
        success: false,
        message: err
      });
    } else {
      console.log('Get following in ' + user);
      Charts.find({author: {$in: user.following}},
        function (err, charts) {
          callback(err, charts)
        })
    }

  })
};

/**
 *
 * @param username
 * @param password
 * @param dob
 * @param email
 * @param callback
 */
userSchema.statics.createUser = function(username, password, dob, email, callback) {
  Users.create({
    username: username,
    password: password,
    dob: dob,
    email: email
  }, function(err, user) {
    callback(err,user)
  })
};


var Users = mongoose.model("Users", userSchema);
module.exports = Users; //keep at bottom of file