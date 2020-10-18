Ssul-community
============

NodeJS, sequelize를 이용해서 구현하였고, MySQL을 이용한 회원관리&게시판기능이 있는 웹사이트입니다.

![Alt text](/public/images/ssul-community(Main).png)

컴포넌트 구조 설명
----------
[java]
* Controller
  * index.js (로그인을 제외한 회원&게시판&댓글 CRUD 기능과 매핑 처리)
  * login.js (로그인 관련 기능과 매핑 처리)
* Domain
  * member
    * users.java (데이터베이스 레코드의 데이터를 매핑하기위한 users데이터 객체)
  * board
    * post.java (데이터베이스 레코드의 데이터를 매핑하기위한 post데이터 객체)
  * reply
    * reply.java (데이터베이스 레코드의 데이터를 매핑하기위한 reply데이터 객체)
[view]
* JS
  * db.js (DB연동처리를 위한 라이브러리)
  * sign.js (회원가입 시 Ajax를 이용해 클라이언트에서 폼값 검증을 위한 JS)
  * mypage.js (회원정보 수정시 Ajax를 이용해 클라이언트에서 폼값 검증을 위한 JS)
  * board_id.js (게시판 상세보기 댓글 이벤트처리 JS)
