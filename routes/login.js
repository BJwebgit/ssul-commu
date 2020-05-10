const express = require('express');
const router = express.Router();
const models = require('../models');
const methodOverride = require('method-override');
const db = require('../lib/db');
const crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/Sign_Up', function(req, res, next) {
  models.post.findAll().then( result => {
    res.render("Sign_Up", {
      posts: result
    });
  });
});

router.post('/Sign_Up/sign_up', function(req, res, next) {
  var post = req.body;
  console.log(post);
  var inputPassword = post.password;
  var salt = Math.round((new Date().valueOf() * Math.random())) + "";
  var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
  db.query(`insert into login (email, password, nickname, tel, area, gender) values(?, ?, ?, ?, ?, ?)`,
    [post.email, hashPassword, post.nickname, post.tel, post.area, post.gender],
    function(err, result){
      if(err){
          throw err;
      }
      res.redirect("/");
  });
});

router.post('/check_id', function(req, res, next) {
  var check = 0;
  let form_id = req.body.id;
  console.log(form_id);
  db.query(`select email FROM login`, function(error, db_email){
    if(error) console.log("[mysql] users DB -> user2.js error ");
    for(var i = 0; i<db_email.length; i++){
      if(db_email[i].email === form_id){
        res.send('0');
        console.log("ID CHECK ajax로 전송완료");
        break;
      }
    }
    if(check === 0){
      res.send('1');
      console.log("ID CHECK ajax로 전송완료");
    }
  });
});

router.post('/check_nick', function(req, res, next) {
  var check = 0;
  let form_nick = req.body.nick;
  console.log("1"+form_nick);
  db.query(`select nickname FROM login`, function(error, db_nick){
    if(error) console.log("[mysql] users DB -> user2.js error ");
    for(var i = 0; i<db_nick.length; i++){
      if(db_nick[i].nickname === form_nick){
        res.send('0');
        console.log("ID CHECK ajax로 전송완료");
        break;
      }
    }
    if(check === 0){
      res.send('1');
      console.log("ID CHECK ajax로 전송완료");
    }
  });
});

module.exports = router;
