var express = require('express');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var shortid = require('shortid');
var router = express.Router();

var client = mysql.createConnection({
   host:'localhost',
   port:'3306',
   user:'4team',
   password:'gachon654321',
   database:'4team'
});

//Naver oAuth2.0 Connecting 변수
var client_id = 'uRqh5LYASazrMiYjyM6D';
var client_secret = 'yjEzakT4Kp';
var state = "RANDOM_STATE";
var redirectURI = encodeURI("http://203.249.127.60:65004/login/oAuth");
var access_token = '';

/* GET home page. */
router.get('/oAuth',function(req,res){
    var code = req.query.code;
    var state = req.query.state;
    var api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
     
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
     
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var obj = JSON.parse(body);
          access_token = obj.access_token;
          console.log(access_token);      
          res.redirect('/login/calback');
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
    
});

router.get('/calback',function(req,res){
    var header = "Bearer " + access_token; // Bearer 다음에 공백 추가
   var api_url = 'https://openapi.naver.com/v1/nid/me';
   var request = require('request');

   var options = {
       url: api_url,
       headers: {'Authorization': header,
                 'X-Naver-Client-Id':client_id,
                 'X-Naver-Client-Secret':client_secret}
    };

       request.post(options, function (error, response, body) {
         if (!error && response.statusCode == 200) {
//             res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//             res.end(body);
             //DB 저장
             var obj = JSON.parse(body);
             var id = shortid.generate();
             var name = obj.response.name;
             var nick = obj.response.nickname;
             var email = obj.response.email;
             console.log(nick);
             
             client.query('SELECT * FROM member WHERE member_email = ?',[email],function(error,results){
                 if(results.length==0){
                     client.query('INSERT INTO member (member_id,member_name,member_nick,member_email,Access_token) VALUES(?,?,?,?,?)',[id,name,nick,email,access_token],function(){
                        req.session.user_id = id;
                        res.redirect('../main');
                        console.log('insert!');
                     });
                 }else{
                     //토큰갱신
                     client.query('UPDATE member SET Access_token = ? WHERE member_email = ?',[access_token,email],function(){
                        var userid = results[0].member_id;
                        req.session.user_id = userid; 
                        res.redirect('../main');
                     });
                 } 
             });
             } 
           else {
               console.log('error');
               if(response != null) {
                 res.status(response.statusCode).end();
                 console.log('error = ' + response.statusCode);
           }
         }
       });
});

module.exports = router;
