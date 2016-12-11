var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../model/user_model.js');
var session = require('express-session');

router.post('/', function (req, res) {
  req.session.username = null;
  req.session.userId = null;
  res.send({loggedOut: true, sucess:"logged out!"});
});

module.exports = router;