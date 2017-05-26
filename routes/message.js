var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('date-utils');
var dt = new Date();

var dbConnection = mysql.createConnection({
        host : 'localhost',
        port : 3306,
        user : '4team',
        password : 'gachon654321',
        database : '4team'
});

/* GET home page. */
router.get('/gallery/pieces/:piece_code/message', function(req, res) {
  var id = req.session.user_id;
  var piece_code = req.params.piece_code;
  dbConnection.query('SELECT * FROM piece join member ON piece.member_id = member.member_id WHERE piece_code=?',[piece_code],function(err,rows){
	res.render('message',{rows:rows});
  }); 
});

/* POST home page. */
router.post('/gallery/pieces/:piece_code/sMessage',function(req,res){
  var piece_code = req.params.piece_code;
  var senderid = req.session.user_id;
  var messageContent = req.body.message;
  var memberid, sendernick;
  var messageDate =  dt.toFormat('YYYY-MM-DD');

  //Sender nickname
    dbConnection.query('SELECT * FROM member WHERE member_id=?',[senderid],function(err,rows){
      if(err){
        console.log('query1: '+err);
      }else{
        sendernick = rows[0].member_nick;
        dbConnection.query('SELECT * FROM piece WHERE piece_code=?',[piece_code],function(err,rows1){
          if(err){
            console.log('query2: '+err);
          }else{
            memberid = rows1[0].member_id;
              dbConnection.query('INSERT INTO message (member_id,message_content,message_senderid,message_sendernick,message_date) VALUES (?,?,?,?,?)',[memberid,messageContent,senderid,sendernick,messageDate],function(){
                 
		 res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8", });
		 res.write("<html><body><script>alert('메시지가 전송되었습니다.'); location='/gallery'</script></body></html>");
    		 res.end();

              });
          }
        });
      }
  });
});

module.exports = router;
