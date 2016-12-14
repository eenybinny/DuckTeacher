
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var client = mysql.createConnection({
        host : 'localhost',
        port : 3306,
        user : '4team',
        password : 'gachon654321',
        database : '4team',
	multipleStatements : true
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

/* GET home page. */
router.get('/', function(req, res) {
  
  client.query('SELECT piece_code,piece_image FROM piece ORDER BY piece_code DESC limit 4; SELECT goods_code, goods_image, goods_numOrder FROM goods ORDER BY goods_code DESC limit 4',function(err, result){
    if(err){ console.log('query error : '+err);}
    res.render('main',{rows : result});
    console.log(result[0]);
    console.log(result[1]);
  });
});

module.exports = router;

