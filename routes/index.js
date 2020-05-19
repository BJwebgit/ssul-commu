const express = require('express');
const models = require('../models');
const router = express.Router();
const db = require('../lib/db');
const methodOverride = require('method-override');
const crypto = require('crypto');
const url = require('url');

function kind_f(kind){
  return `select * from posts where ${kind} like ? order by createdAt desc limit ?,?`
}

function kind_f2(kind, kind2){
  return `select * from posts where ${kind} like ? or ${kind2} like ? order by createdAt desc limit ?,?`
}

/* GET home page. */
router.get('/', function(req, res, next) {
  models.post.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']]
    }).then( result => {
    models.post.findAll({
      limit: 5,
      order: [['views', 'DESC']]
      }).then( result2 => {
      if(req.session.email === undefined){
        var req_email = req.session.email;
        res.render("index", {
          posts: result, vposts: result2, session:req_email
        });
      }
      else{
        var req_email = req.session.email;
        var req_id = req_email.split("@");
        res.render("index", {
          posts: result, vposts: result2, session:req_id
        });
      }
    });
  });
});

router.get('/mypage', function(req, res, next) {
  var req_email = req.session.email;
  var req_id = req_email.split("@");
  db.query(`select * FROM login where nickname=?`, 
  [req.session.nickname],
  function(error, result){
    if(error) console.log("[mysql] users DB -> user2.js error ");
    res.render('mypage', {
      post: result, session: req_id
    });
  });
});

router.post('/mypage', function(req, res, next) {
  var post = req.body;
  var inputPassword = post.password;
  var hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");
  db.query(`update login set password=?, nickname=?, tel=?, area=?, gender=? where email=?`,
  [hashPassword, post.nickname, post.tel, post.area, post.gender, post.email],
  function(error, result){
    db.query(`update posts set writer=? where loginemail=?`,
    [post.nickname, post.email],
    function(error, result){
      if(error) console.log("[mysql] login DB update error! ");
      req.session.destroy(function(err){
        if(err){
          throw err
        }
        res.redirect("/login");
      });
    });
  });
});

router.get('/logout', function(req, res, next) {
  models.post.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']]
  }).then( result => {
    req.session.destroy(function(err){
      if(err){
        throw err
      }
      res.redirect("/");
    });
  });
});

router.get('/secession', function(req, res, next) {
  var req_email = req.session.email;
  var req_id = req_email.split("@");
  db.query(`select * FROM login where nickname=?`, 
  [req.session.nickname],
  function(error, result){
    if(error) console.log("[mysql] users DB -> user2.js error ");
    res.render('secession', {
      post: result, session: req_id
    });
  });
});

router.post('/secession', function(req, res, next) {
  var post = req.body;
  var inputPassword = post.password;
  var hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");
  db.query(`select password from login where email=?`,
  [req.session.email],
  function(error, result){
    if(error) console.log("[mysql] login DB update error! ");
    if(hashPassword === result[0].password){
      db.query(`delete from login where email=?`,
      [req.session.email],
      function(error, result){
        req.session.destroy(function(err){
          if(err){
            throw err
          }
          res.redirect("/");
        });
      });
    }
    else{
      res.redirect("/secession");
    }
  });
});

router.get('/board/write', function(req, res, next) {
  var req_email = req.session.email;
  var req_id = req_email.split("@");
  var req_nickname = req.session.nickname;
  res.render('write', {
    session: req_id, nick: req_nickname
  });
});

router.post('/board/write', function(req, res, next) {
  var req_email = req.session.email;
  let body = req.body;
  models.post.create({
    loginemail: req_email, 
    title: body.inputTitle,
    writer: body.inputWriter,
    content: body.content,
    views: 1
  })
  .then( result => {
    console.log("데이터 추가 완료");
    res.redirect("/board/1");
  })
  .catch( err => {
    console.log("데이터 추가 실패");
  })
});

router.get('/board/:page', function(req, res, next) {
  var page = req.params.page;
  var kind = req.query.kinds;
  page = parseInt(page, 10);
  var size = 10;
  var begin = (page-1)*size;
  if(req.query.kinds === undefined){
    db.query(`select count(*) cnt from posts`,
    function(err, result){
      var cnt = result[0].cnt;
      var totalPage = Math.ceil(cnt / size);
      var pageSize = 10;
      var startPage = Math.floor((page-1) / pageSize)*pageSize + 1;
      var endPage = startPage + (pageSize - 1);
      if(endPage > totalPage){
        endPage = totalPage;
      }
      var max = cnt - ((page-1)*size);
      db.query(`select * from posts order by createdAt desc limit ?,?`,
        [begin, size],
        function(err, result){
          var datas = {
            post : result,
            page: page,
            pageSize: pageSize,
            startPage: startPage,
            endPage: endPage,
            totalPage: totalPage,
            max: max,
            session:false,
            kind: false
          };
          if(req.session.email === undefined){
            res.render("board", datas);
          }
          else{
            var req_email = req.session.email;
            var req_id = req_email.split("@");
            datas.session = req_id;
            res.render("board", datas);
          }
      });
    });
  }
  else{
    var diff = '';
    if(kind === 'titlecontent'){
      diff = `select count(*) cnt from posts where title like '%${req.query.content}%' or content like '%${req.query.content}%'` 
    }
    else{
      diff = `select count(*) cnt from posts where ${kind} like '%${req.query.content}%'`
    }
    db.query(`${diff}`,
    function(err, result){
    var cnt = result[0].cnt;
    var totalPage = Math.ceil(cnt / size);
    var pageSize = 10;
    var startPage = Math.floor((page-1) / pageSize)*pageSize + 1;
    var endPage = startPage + (pageSize - 1);
    if(endPage > totalPage){
      endPage = totalPage;
    }
    var max = cnt - ((page-1)*size);
    if(kind === 'titlecontent'){
      db.query(`${kind_f2('title','content')}`,
      ["%"+req.query.content+"%", "%"+req.query.content+"%", begin, size],
      function(err, result){
        var datas = {
          post : result,
          page: page,
          pageSize: pageSize,
          startPage: startPage,
          endPage: endPage,
          totalPage: totalPage,
          max: max,
          session:false,
          kind: req.query
        };
        if(req.session.email === undefined){
          res.render("board", datas);
        }
        else{
          var req_email = req.session.email;
          var req_id = req_email.split("@");
          datas.session = req_id;
          res.render("board", datas);
        }
      });
    }
    else{
      db.query(`${kind_f(kind)}`,
      ["%"+req.query.content+"%", begin, size],
      function(err, result){
        var datas = {
          post : result,
          page: page,
          pageSize: pageSize,
          startPage: startPage,
          endPage: endPage,
          totalPage: totalPage,
          max: max,
          session:false,
          kind: req.query
        };
        if(req.session.email === undefined){
          res.render("board", datas);
        }
        else{
          var req_email = req.session.email;
          var req_id = req_email.split("@");
          datas.session = req_id;
          res.render("board", datas);
        }
      });
      }
    });
  }
});

router.get('/board/user/:id', function (req, res, next) {
  var req_nickname = req.session.nickname;
  let postID = req.params.id;
  models.post.findOne({
    where: { id: postID }
  }).then(result => {
    models.post.update({views: result.views+1},{
      where: { id: postID }
    }).then(result3 => { 
      models.reply.findAll({
        where:{postId:postID}
      }).then(result2 =>{ 
        if(req.session.email === undefined){
          res.render("board_id", {
            post: result, replies:result2, session:false, nick: req_nickname
          });
        }
        else{
          var req_email = req.session.email;
          var req_id = req_email.split("@");
          res.render("board_id", {
            post: result, replies:result2, session:req_id, nick: req_nickname
          });
        }
    })
    })
  })
});

router.post('/board/user/:id', function(req, res, next) {
  let postID = req.params.id;
  let body = req.body;
  let post = req.session.email;
  models.reply.create({
    re_email: post,
    postId: postID,
    writer: body.inputWriter,
    content: body.content
  })
  .then( results => {
    res.redirect(`/board/user/${postID}`);
  })
  .catch( err => {
    console.log(err);
  });
});

router.get('/board/update/:id', function(req, res, next) {
  let postID = req.params.id;
  var req_email = req.session.email;
  var req_id = req_email.split("@");
  models.post.findOne({
    where: {id: postID}
  })
  .then( result => {
    res.render("update", {
      post: result, session: req_id
    });
  })
  .catch( err => {
    console.log("데이터 조회 실패");
  });
});

router.put('/board/update/:id', function(req, res, next) {
  let  postID = req.params.id;
  let body = req.body;
  models.post.update({
    title: body.inputTitle,
    writer: body.inputWriter,
    content: body.content
  },{
    where: {id: postID}
  })
  .then( result => {
    console.log("데이터 수정 완료");
    res.redirect(`/board/1`);
  })
  .catch( err => {
    console.log("데이터 수정 실패");
  });
});

router.delete('/board/:id', function(req, res, next) {
  let postID = req.params.id;

  models.post.destroy({
    where: {id: postID}
  })
  .then( result => {
    res.redirect("/board/1")
  })
  .catch( err => {
    console.log("데이터 삭제 실패");
  });
});

router.delete('/board/reply/:id', function(req, res, next) {
  let post = req.body;
  let nick = req.session.nickname;
  let postID = req.params.id;
  models.reply.destroy({
    where: {id: post.reply_id}
  })
  .then( result => {
    res.redirect(`/board/user/${postID}`);
  })
  .catch( err => {
    console.log("데이터 삭제 실패");
  });
});

module.exports = router;
