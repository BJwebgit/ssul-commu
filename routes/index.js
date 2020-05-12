const express = require('express');
const models = require('../models');
const router = express.Router();
const methodOverride = require('method-override');

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
      res.render("index", {
        posts: result, vposts: result2, session:req.session
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

router.get('/board/write', function(req, res, next) {
  var req_email = req.session.email;
  var req_id = req_email.split("@");
  var req_nickname = req.session.nickname;
  console.log(req.session);
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
  if(req.session.email === undefined){
    models.post.findAll().then( result => {
      var num = result.length%2;
      var result_length = 0;
      if(num === 0){
        result_length = result.length;
      }
      else{
        result_length = result_length+1;
      }
      console.log(result_length);
      res.render("board", {
        posts: result, session:false, page: page, length: result.length-1, page_num: 1, result_leng: result_length
      });
    });
  }
  else{
    models.post.findAll().then( result => {
      res.render("board", {
        posts: result, session:req.session, page: page, length: result.length-1, page_num: 1, result_leng: result_length
      });
    });
  }
});

router.get('/board/user/:id', function (req, res, next) {
  var req_email = req.session.email;
  var req_id = req_email.split("@");
  var req_nickname = req.session.nickname;
  let postID = req.params.id;
  models.post.findOne({
    where: { id: postID }
  }).then(result => {
    console.log("findOne");
    models.post.update({views: result.views+1},{
      where: { id: postID }
    }).then(result3 => { 
      console.log("update");
      models.reply.findAll({
        where:{postId:postID}
      }).then(result2 =>{ 
      res.render("board_id", {
        post: result, replies:result2, session:req_id, nick: req_nickname
      });
    })
    })
  })
});

router.post('/board/user/:id', function(req, res, next) {
  let postID = req.params.id;
  let body = req.body;
  models.reply.create({
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

  models.post.findOne({
    where: {id: postID}
  })
  .then( result => {
    res.render("update", {
      post: result, session: req.session
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
  let nick = req.session.nickname;

  models.reply.destroy({
    where: {writer: nick}
  })
  .then( result => {
    res.redirect("/board/1")
  })
  .catch( err => {
    console.log("데이터 삭제 실패");
  });
});

module.exports = router;
