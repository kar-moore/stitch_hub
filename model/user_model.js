var mongoose = require('mongoose');
var passwordSecurer = require('../routes/password_securer.js')();

var validators = require('mongoose-validators');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  dob: {type: Date, validate: [validators.isDate()]},
  email: {type: String, validate: validators.isEmail()},
  following: [{type: ObjectId, ref: "User"}]
});

/**
 * Given an ID, get a specific user.
 *
 * @param userId {ObjectId} ID of user in question
 * @param callback function to execute
 */
userSchema.statics.getUserById = function (userId, callback) {
  Users.findOne({
    _id: userId
  }, function (err, user) {
    callback(err, user);
  });
};

/**
 * TODO
 * @param userId
 * @param callback
 */
userSchema.statics.isLoggedIn = function (userId,callback){
  var isLoggedIn = false;
  Users.getUserById(userId,function(err,user){
    if (user){
      isLoggedIn = true;
    }
    callback(err, isLoggedIn);
  });
};//end isLoggedIn


/**
 * Make one specified user follow another specified user.
 *
 * @param currentUser {ObjectId} ID of user
 * @param userToFollow {ObjectId} ID of user to follow
 * @param callback function to execute
 */
userSchema.statics.followUser = function (currentUser, userToFollow, callback) {
  Users.isLoggedIn(currentUser, function(err,isLoggedIn){
    if (isLoggedIn){

      Users.findOneAndUpdate(
        {_id: currentUser},
        {$addToSet: {following: userToFollow}},
        {new:true},
        function (err, user) {
          callback(err, user);
        });//end findone
    } //end if
    else{
      callback(err);
      //callback(err, isLoggedIn);
    }//end else
  });//end isLoggedIn
};

userSchema.statics.unfollowUser = function(currentUser, userToUnfollow, callback){
  Users.isLoggedIn(currentUser, function(err,isLoggedIn){

    if (isLoggedIn){
      //if they are following the user
      Users.findOne({_id: currentUser},function (err, currentUser){
        if (err){
          callback(err);
        }//end if
        else{
          var following = currentUser.following;
          var indexOfUser = following.indexOf(userToUnfollow);
          if (indexOfUser != -1){
            following.splice(indexOfUser,1);
            Users.findOneAndUpdate(
              {_id: currentUser},
              {following:following},
              function (err, user) {
                callback(err, user);
            });//end findone
          }
        }//end else
      });//end find one
    }//end if

    else{
      callback(err, isLoggedIn);
    } //end else
  }); //end isLoggedIn
};  //end unfollowUser

/**
 * Create a new User.
 *
 * @param username {String} username of user
 * @param password {String} hashed password of user
 * @param dob {Date} user's birthday
 * @param email {String} user's email address
 * @param callback function to execute
 */
userSchema.statics.createUser = function(username, password, dob, email, callback) {
  var salt = passwordSecurer.generateSalt();
  var hashedPassword = passwordSecurer.createHash(salt, password);
  Users.create({
    username: username,
    password: hashedPassword,
    dob: dob,
    salt: salt,
    email: email
  }, function(err, user) {
    callback(err,user);
  });
};

/**
 * Check if User is an adult (18+)
 *
 * @param userId {ObjectId} ID of User
 * @param callback function to execute
 */
userSchema.statics.isAdult = function(userId,callback) {
  Users.getUserById(userId, function(err,user) {
    if (err) {
      callback(err);
    } else {
      // Age calculation code from: http://stackoverflow.com/a/15555947
      function calcAge(dateString) {
        var birthday = +new Date(dateString);
        return ~~((Date.now() - birthday) / (31557600000));
      }
      if (calcAge(user.dob) >= 18) {
        callback(err,true);
      } else {
        callback(err,false);
      }
    }
  });
};


var Users = mongoose.model("Users", userSchema);
module.exports = Users; //keep at bottom of file