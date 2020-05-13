const express = require('express');
const router = express.Router();
const models = require('../models');
const methodOverride = require('method-override');
const db = require('../lib/db');
const crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  var post = req.body;
  var inputPassword = post.password;
  db.query(`select email, password, nickname from login where email=?`,
    [post.email],
    function(err, result){
      if(err){
          throw err;
      }
      if(result[0] === undefined){
        res.redirect("/login");
      }
      else{
        var dbpassword = result[0].password;
        var hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");
        if(dbpassword === hashPassword){
          console.log("비밀번호 일치");
          req.session.email = post.email;
          req.session.nickname = result[0].nickname;
          res.redirect("/");
        }
        else{
          console.log("비밀번호 불일치");
          res.redirect("/login");
        }
      }
  });
});

router.post('/check_login', function(req, res, next) {
  var check = 0;
  let form_id = req.body.id;
  db.query(`select email FROM login`, function(error, db_email){
    if(error) console.log("[mysql] users DB -> user2.js error ");
    for(var i = 0; i<db_email.length; i++){
      if(db_email[i].email === form_id){
        check = 1;
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

router.get('/Sign_Up', function(req, res, next) {
  models.post.findAll().then( result => {
    res.render("Sign_Up", {
      posts: result
    });
  });
});

router.post('/Sign_Up/sign_up', function(req, res, next) {
  var post = req.body;
  var inputPassword = post.password;
  var hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");
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
  db.query(`select nickname FROM login`, function(error, db_id){
    if(error) console.log("[mysql] users DB -> user2.js error ");
    for(var i = 0; i<db_id.length; i++){
      if(db_id[i].nickname === form_id){
        check = 1;
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
