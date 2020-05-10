var express = require('express');
var router = express.Router();
var mysql = require("mysql");

let db = mysql.createConnection({
  user: "root",
  password: "111111",
  database: "comm_login"
})
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/Sign_Up', function(req, res, next) {
  res.render('Sign_Up', { title: 'Express' });
});

router.post('/Sign_Up/sign_up', function(req, res, next) {
  var post = req.body;
  db.query(`insert into login (email, password, nickname, tel, area, gender) values(?, ?, ?, ?, ?, ?)`,
    [post.email, post.password, post.nickname, post.tel, post.area, post.gender],
    function(err, result){
      if(err){
          throw err;
      }
      res.redirect("/");
  });
});

module.exports = router;
