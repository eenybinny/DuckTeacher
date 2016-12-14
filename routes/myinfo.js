var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
require('date-utils');
var dt = new Date();

var client = mysql.createConnection({
        host : 'localhost',
        port : 3306,
        user : '4team',
        password : 'gachon654321',
        database : '4team'
});

/* Session Check*/
router.use(function(req,res,next){
  if(req.session.user_id){
    console.log('로그인 정보 있음');
    next();
  }else{
    //ALERT!
    res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8", });
    res.write("<html><body><script>alert('로그인을 해주세요!'); location='../'</script></body></html>");
    res.end();
  }
});

/* GET myinfo page. */
router.get('/', function(req, res) {
  res.render('myinfo');
});

router.get('/logout',function(req,res){
    //Session Destroy
    req.session.destroy(function(err){
        res.redirect('../');
    });
});

router.get('/pieces', function(req, res) {
  var id = req.session.user_id;
  
  client.query('SELECT * FROM piece WHERE member_id=?',[id],function(err,rows){
    res.render('mypiece_search',{rows:rows});
  });
});

router.get('/pieces/:piece_code', function(req,res){
   var piece_code = req.params.piece_code;

   client.query('SELECT * FROM piece join member ON piece.member_id = member.member_id WHERE piece_code=?',[piece_code],function(err,rows){
    res.render('mygallery_detail',{rows:rows});
 });
});

router.get('/pieces/:piece_code/modify',function(req,res){
  var piece_code = req.params.piece_code;

  client.query('SELECT * FROM piece join member ON piece.member_id = member.member_id WHERE piece_code=?',[piece_code],function(err,rows){
    res.render('mygallery_detailMod',{rows:rows});
 });
});

router.post('/pieces/:piece_code/modify',function(req,res){
  var piece_code = req.params.piece_code;
  var name = req.body.name;
  var content = req.body.content;

  client.query('UPDATE piece SET piece_name=?, piece_content=? WHERE piece_code=?',[name,content,piece_code],function(err,rows){
    if(err){console.log(err);}
    res.writeHeader(200, {"content-Type": "text/html;charset = utf-8", });
    res.write("<HTML><BODY><SCRIPT>alert('수정되었습니다!'); location='/myinfo/pieces'</script></body></html>");
    res.end();
  });
});


router.get('/pieces/:piece_code/delete', function(req, res){
    var piece_code = req.params.piece_code;
    client.query('DELETE FROM piece WHERE piece_code = ?', [piece_code], function() {
        res.writeHeader(200, {"content-Type": "text/html; charset = utf-8", });
        res.write("<HTML><BODY><SCRIPT>alert('삭제되었습니다!'); location='/myinfo/pieces'</script></body></html>");
        res.end();
    });
});

router.get('/goods', function(req, res) {
  var id = req.session.user_id;

  client.query('SELECT * FROM goods WHERE member_id=?',[id],function(err,rows){
    res.render('mygoods_search',{rows:rows});
  });
});

router.get('/goods/:goods_code', function(req, res) {
    var id = req.session.user_id;
    var goods_code = req.params.goods_code;
   client.query('SELECT * FROM goods join member ON goods.member_id = member.member_id WHERE goods_code=?',[goods_code],function(err,rows){
    res.render('mygoods_detail',{rows:rows});
 });
});

router.get('/goods/:goods_code/delete', function(req, res) {
    var code = req.params.goods_code;
   client.query('DELETE FROM goods WHERE goods_code = ?', [code] , function() {
        res.writeHeader(200, {"content-Type": "text/html; charset = utf-8", });
        res.write("<HTML><BODY><SCRIPT>alert('삭제되었습니다!'); location='/myinfo/goods'</script></body></html>");
        res.end();

   });
});

router.get('/goods/:goods_code/modify', function(req,res){
    var goods_code = req.params.goods_code;
   client.query('SELECT * FROM goods join member ON goods.member_id = member.member_id WHERE goods.goods_code=?',[goods_code],function(err,rows){
    if(err){console.log(err);}
    res.render('mygoods_detailMod',{rows:rows});
 });
});

router.post('/goods/:goods_code/modify', function(req,res){
    var goods_code = req.params.goods_code;
    var goods_name = req.body.goodsName;
    var goods_cost = req.body.goodsPrice;
    var goods_order = req.body.goodsOrder;
    var goods_sale = req.body.goodsSale;
    var goods_content = req.body.goodsContent;
    
    console.log(goods_code);
    console.log(goods_name);
    
    client.query('UPDATE goods SET goods_name = ?, goods_cost = ?, goods_order = ? , goods_sale = ? , goods_content = ? WHERE goods_code = ? ', [goods_name,goods_cost,goods_order,goods_sale,goods_content,goods_code], function(err,rows){
        if(err) console.error('query error : '+ err);
        console.log('rows : '+JSON.stringify(rows));

        res.writeHeader(200, {"content-Type": "text/html; charset = utf-8", });
        res.write("<HTML><BODY><SCRIPT>alert('수정되었습니다!'); location='/myinfo/goods'</script></body></html>");
        res.end();

  });
});

router.get('/buy', function(req, res) {
  var id = req.session.user_id;
  client.query('SELECT * FROM buy JOIN goods ON buy.goods_code=goods.goods_code WHERE buy.member_id=?',[id],function(err,rows){
	if(err){console.log(err);}
	res.render('mybuy',{rows:rows});
	console.log(rows);
  });
});

router.get('/buy/delete/:buy_num', function(req, res){
    var code = req.params.buy_num;
    client.query('DELETE FROM buy WHERE buy_num = ?', [code], function() {
        res.writeHeader(200, {"content-Type": "text/html;charset = utf-8", });
        res.write("<HTML><BODY><SCRIPT>alert('삭제되었습니다!'); location='/myinfo/buy'</script></body></html>");
        res.end();
    });
});

router.get('/sell', function(req, res) {
var id = req.session.user_id;
    
    client.query('SELECT * FROM goods WHERE member_id=?',[id],function(err,rows){
        res.render('mysell', {rows:rows});
    });
});

router.get('/sell/delete/:goods_code', function(req, res){
    var code = req.params.goods_code;
    client.query('DELETE FROM goods WHERE goods_code = ?', [code], function() {
        res.writeHeader(200, {"content-Type": "text/html;charset = utf-8", });
        res.write("<HTML><BODY><SCRIPT>alert('삭제되었습니다!'); location='/myinfo/sell'</script></body></html>");
        res.end();
    });
});

router.get('/message', function(req, res) {
    var id = req.session.user_id;
    client.query('SELECT * FROM message WHERE member_id = ?',[id],function(err,rows){
       res.render('mymsg',{rows:rows}); 
    });
});

router.get('/message/reply/:msg_index',function(req,res){
    var index = req.params.msg_index;
    client.query('SELECT * FROM message WHERE msg_index = ?',[index],function(err,rows){
	if(err){
	console.log(err);
	}else{
	console.log(rows.length);
	console.log(rows[0].message_sendernick);
       res.render('replyMessage',{rows:rows});
	} 
    });
});

router.post('/message/reply/:member_id',function(req,res){
   var memberid = req.params.member_id;
   var senderid = req.session.user_id;
   var messageContent = req.body.message;
   var sendernick;
   var messageDate = dt.toFormat('YYYY-MM-DD');
    
    client.query('SELECT * FROM member WHERE member_id = ?',[senderid],function(err,rows){
       if(err){
           console.log(err);
       }else{
           sendernick = rows[0].member_nick;
           console.log(sendernick);
           client.query('INSERT INTO message (member_id,message_content,message_senderid,message_sendernick,message_date) VALUES (?,?,?,?,?)',[memberid,senderid,messageContent,sendernick,messageDate],function(){
               //ALERT
               res.writeHeader(200,{"Content-Type":"text/html;charset = utf-8"});
               res.write("<html><body><script>alert('쪽지 전송 완료!');location='/myinfo/message/'</script></body></html>");
               res.end();
           });
       } 
    });
});

router.get('/message/delete/:msg_index',function(req,res){
    var index = req.params.msg_index;
    client.query('DELETE FROM message WHERE msg_index = ?',[index],function(){
       //ALERT!
        res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8", });
        res.write("<html><body><script>alert('삭제되었습니다!'); location='/myinfo/message'</script></body></html>");
        res.end(); 
    });
});

router.get('/info', function(req, res) {
  var id = req.session.user_id;

  client.query('SELECT * FROM member where member_id=?',[id],function(err,rows){
    
    res.render('myaccount_client',{rows: rows});

  });
  console.log(id);
});

router.get('/info/modify',function(req,res){
  var id = req.session.user_id;
  client.query('SELECT * FROM member WHERE member_id=?',[id],function(err,rows){
    res.render('myaccount_clientMod',{rows:rows});
  });
});

router.post('/info/modify',function(req,res){
  var id = req.session.user_id;
  var member_nick = req.body.myNick;
  var member_email = req.body.myEmail; 
  client.query('UPDATE member SET member_nick=?, member_email=? WHERE member_id=?',[member_nick,member_email,id],function(err,rows){

     if(err){console.log(err);}
     console.log(member_nick);
     res.redirect('/myinfo/info');
  });
});

router.get('/info/delete',function(req,res){
    var memberid = req.session.user_id;
    var access_token;
    var client_id = 'uRqh5LYASazrMiYjyM6D';
    var client_secret = 'yjEzakT4Kp';
    var request = require('request');
    
    client.query('SELECT * FROM member WHERE member_id = ?',[memberid],function(err,rows){
       if(err){
           console.log(err);
       }else{
           access_token = rows[0].Access_token;
           var api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id='
     + client_id + '&client_secret=' + client_secret + '&access_token=' + access_token + '&service_provider=NAVER';
           var options = {
                url: api_url,
                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
             };

            request.get(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log(body);
                  client.query('DELETE member, piece, goods, buy, message FROM member LEFT JOIN piece ON  piece.member_id = member.member_id LEFT JOIN goods ON goods.member_id = member.member_id LEFT JOIN buy ON buy.member_id = member.member_id LEFT JOIN message ON  message.member_id = member.member_id WHERE member.member_id = ?',[memberid],function(){
                      //Session Destroy
                    req.session.destroy(function(err){
			         //ALERT!
                        res.writeHeader(200, {"Content-Type": "text/html ;charset = utf-8", });
                        res.write("<html><body><script>alert('탈퇴되었습니다!'); location='http://203.249.127.60:65004/'</script></body></html>");
                        res.end(); 
                    });
                  });
              } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
              }
            });
       } 
    });
});

module.exports = router;
