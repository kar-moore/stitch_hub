var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../model/user_model.js');
var Charts = require('../model/chart_model.js');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

/**
 * Handles GET request for User by User's ID.
 *
 * If success, responds with 200 message and message--> user:User
 * If err, responds with message--> success:false, message:err
 */
router.get('/:id', function (req, res) {
  var userId = req.params.id;
  Users.getUserById(userId, function (err, user) {
    if (err) {
      res.send({
        success: false,
        message: err
      });
    } //end if
    else {
      res.send(200,{user: user});
    } // end else
  });
});

/**
 * Handles PUT request to follow User.
 *
 * If success in following, sends message--> updated:true
 * If User is already following User, sends message--> updated:false
 * If error, sends message--> success:false, message:err
 */
router.put('/user/:userId/following', csrfProtection, function (req, res) {
  var userIDToFollow = req.body.userIdToFollow;
  var userId = req.params.userId;
  Users.followUser(userId, userIDToFollow,
    function (err, user) {
      if (err) {
        res.send({
          success: false,
          message: err
        }); //end if
      } else {
        if (user) {
          res.send({updated: true});
        } else {
          res.send({updated: false});
        }
      }
    });
});

/**
 * Handles GET request for specified User's followers' Charts.
 *
 * If success, sends list of charts.
 * If error, sends message--> success:false, message:err
 */
router.put('/user/:userId/remove/following', csrfProtection, function (req, res) {
  var userIDToUnfollow = req.body.userIdToUnfollow;
  var userId = req.params.userId;
  Users.unfollowUser(userId, userIDToUnfollow,
    function (err, user) {
      if (err) {
        res.send({
          success: false,
          message: err
        }); //end if
      } else {
        if (user) {
          res.send({updated: true});
        } else {
          res.send({updated: false});
        }
      }
    });
});

/**
 * TODO
 */
router.get('/user/:userId/following/charts', function (req, res) {
  var userId = req.params.userId; // TODO: denisli fix
  Charts.getFollowersCharts(userId,
    function (err, charts) {
      if (err) {
        res.send({
          success: false,
          message: err
        });
      } else {
        res.send(charts);
      }
    });
});

/**
 * Handles POST request to create new User.
 *
 * If error, sends message--> success:false, message:err
 * If user created, sends message--> registered:true
 * If user not created, sends message--> registered:false
 */
router.post('/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var dob = req.body.dob;
  var email = req.body.email;

  Users.createUser(username, password, dob, email, function (err, user) {
      if (err) {
        res.send({
          success: false,
          message: err
        }); //end if
      } else {
        if (user) {
          res.send({registered: true});
        } else {
          res.send({registered: false});
        }
      }
    }
  );
});

module.exports = router;

