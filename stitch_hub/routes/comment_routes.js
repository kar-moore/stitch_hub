var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = require('../model/comment_model.js');
var passport = require('passport');
var Users = require('../model/user_model.js');


router.post('/', function(req, res){
  
    if (!req.session.username) {
        res.send(400, {msg:"user not logged in"});
        return;
    }

    Comment.create(
          {user: req.session.userId, chart: req.body.chartID, text:req.body.text }, 
          function(err, like){
              if (err) {
                console.log("error creating like");
                console.log(err);
                res.send(
                  {success: false,
                  message: err,
                  error: "error creating like"}
                  ); //end if
              } else{
                res.sendStatus(200,{sucess:"comment created!"}); // send a response
              }
            });
    });


router.get('/',function(req, res, next){
    var chartID = req.query.chartID;
    console.log("chart " + req.query.chartID);
    Comment
    .find({chart:chartID}, function(err, comments){
         if (err) {
             console.log(err);
             res.send({
                 success: false,
                 message: err,
                 error:"error getting comments"
             }); //end if
         } else{
            res.send(200,{
              success: true,
              message: comments
          });
        } //end else
    })
});


module.exports = router;