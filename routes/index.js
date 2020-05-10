const express = require('express');
const models = require('../models');
const router = express.Router();
const methodOverride = require('method-override');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/board', function(req, res, next) {
  models.post.findAll().then( result => {
    res.render("board", {
      posts: result
    });
  });
});

router.get('/board/write', function(req, res, next) {
  res.render('write');
});

router.post('/board/write', function(req, res, next) {
  let body = req.body;
  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter,
    content: body.content
  })
  .then( result => {
    console.log("데이터 추가 완료");
    res.redirect("/board");
  })
  .catch( err => {
    console.log("데이터 추가 실패");
  })
});

router.get('/board/:id', function (req, res, next) {
  let postID = req.params.id;
  models.post.findOne({
    where: { id: postID }
  }).then(result => {
    models.reply.findAll({
      where:{postId:postID}
    }).then(result2 =>{ 
    res.render("board_id", {
      post: result,replies:result2
    });
    })
  })
});

router.post('/board/:id', function(req, res, next) {
  let postID = req.params.id;
  let body = req.body;
  console.log(postID);
  models.reply.create({
    postId: postID,
    writer: body.inputWriter,
    content: body.content
  })
  .then( results => {
    res.redirect(`/board/${postID}`);
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
      post: result
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
    title: body.editTitle,
    writer: body.editWriter,
    content: body.content
  },{
    where: {id: postID}
  })
  .then( result => {
    console.log("데이터 수정 완료");
    res.redirect(`/board/${postID}`);
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
    res.redirect("/board")
  })
  .catch( err => {
    console.log("데이터 삭제 실패");
  });
});

module.exports = router;
