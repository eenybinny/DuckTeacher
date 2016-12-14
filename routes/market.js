var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateutils = require('date-utils');
var dt = new Date();
var d = dt.toFormat('YYYY-MM-DD');
var multer = require('multer');
var storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null, '/home/4team/4team/svr/duckExpress/public/images/');
  },
  filename: function(req,file,cb){
    cb(null, file.originalname);
  }
});

var dbConnection = mysql.createConnection({
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

var upload = multer({storage : storage});

/* GET home page. */
router.get('/',function(req,res,next){
  dbConnection.query('SELECT * FROM goods order by goods_code desc',function(err,rows){
    if(err){console.log('query error: '+err);}
    res.render('market',{rows:rows});
  });
});

/*검색하기*/
router.get('/search/author', function(req, res){
    var search_word = req.param('searchWord');
    var searchCondition = {$regex:search_word};
    
    dbConnection.query('SELECT * FROM member join goods ON member.member_id = goods.member_id WHERE member_nick=?',[search_word], function(err,rows){
        if(rows[0]==null) {
            res.render('search_none');
        } else {
        res.render('goods_search',{rows:rows});
        }
    });
});

router.get('/search/goods', function(req, res){
    var search_word = req.param('searchWord');
    var searchCondition = {$regex:search_word};
    
    dbConnection.query('SELECT * FROM goods WHERE goods_name = ? ', [search_word], function(err,rows){
        if(rows[0]==null) {
            res.render('search_none');
        } else {
        res.render('goodsName_search',{rows:rows});

        }
    });
});


router.get('/goods/:goods_code/:goods_numOrder', function(req,res){
   var goods_code = req.params.goods_code;
  
 dbConnection.query('SELECT * FROM goods join member ON goods.member_id = member.member_id WHERE goods_code=?',[goods_code],function(err,rows){
    res.render('market_detail',{rows:rows});
    console.log(rows);
 });
});

router.post('/goods/:goods_code/:goods_numOrder', function(req, res) {
    var goods_code = req.params.goods_code;

    var numOrder = req.params.goods_numOrder;
    var member_id = req.session.user_id;
    var num = parseInt(numOrder);
    var goodsCode = parseInt(goods_code);
    
    num ++ ;
    
    dbConnection.query('UPDATE goods SET goods_numOrder = ? WHERE goods_code = ?;INSERT INTO buy(member_id,goods_code,buy_date) values(?,?,?) ', [num, goodsCode,member_id,goodsCode,d], function (err) {
        if(err) console.error('query error : ' + err);
        res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8", });
         res.write("<html><body><script>alert('구매신청 완료되었습니다'); location='/market'</script></body></html>");
         res.end();

    });  
});

router.get('/upload', function(req, res) {
res.render('marketUpload');
});

router.post('/upload', upload.single('uploadFile'), function(req,res){
    var goodsName = req.body.goodsName;
    var goodsContent = req.body.goodsContent;
    var goodsPrice = req.body.goodsPrice ;
    var goodsOrder = req.body.goodsOrder ;
    var goodsSale = req.body.goodsSale;
    var goodsImage = req.file.originalname;
    var id = req.session.user_id;

  var datas = [id, goodsName, goodsContent, d, goodsPrice, goodsOrder, goodsSale, goodsImage,'/home/4team/4team/svr/duckExpress/public/images', 0];

  dbConnection.query('INSERT INTO goods(member_id, goods_name, goods_content, goods_date, goods_cost, goods_order, goods_sale, goods_image, goods_image_url,goods_numOrder) values(?,?,?,?,?,?,?,?,?,?)',datas, function(err,rows){
        if(err) console.error('query error : '+ err);
        console.log('rows : '+JSON.stringify(rows));
	res.redirect('/market');
  });
  console.log(req.file);
});

module.exports = router;
exports.connection = dbConnection;
