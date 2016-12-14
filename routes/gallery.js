var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('date-utils');
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
router.get('/',function(req,res,next){
  
  dbConnection.query('SELECT * FROM piece order by piece_code desc',function(err,rows){
    if(err){console.log('query error: '+err);}
    
    res.render('gallery',{rows:rows});

  });
  
});

router.get('/search/author', function(req, res){
    var search_word = req.param('searchWord');
    var searchCondition = {$regex:search_word};
    
    dbConnection.query('SELECT * FROM member join piece ON member.member_id = piece.member_id WHERE member_nick=?',[search_word], function(err,rows){
        if(rows[0]==null) {
            res.render('search_none');
        } else {
        res.render('piece_search',{rows:rows});
        }
    });
});

router.get('/search/piece', function(req, res){
    var search_word = req.param('searchWord');
    var searchCondition = {$regex:search_word};
    
    dbConnection.query('SELECT * FROM piece WHERE piece_name = ? ', [search_word], function(err,rows){
        if(rows[0]==null) {
            res.render('search_none');
        } else {
        res.render('pieceName_search',{rows:rows});

        }
    });
});


router.get('/pieces/:piece_code', function(req,res){
   var piece_code = req.params.piece_code;
  
   dbConnection.query('SELECT * FROM piece join member ON piece.member_id = member.member_id WHERE piece_code=?',[piece_code],function(err,rows){
    res.render('gallery_detail',{rows:rows});
 });
});

router.get('/upload',function(req,res,next){
    res.render('galleryUpload');
});

router.post('/upload', upload.single('uploadFile'), function(req,res){
  var pieceName = req.body.pieceName;
  var pieceContent = req.body.pieceContent;
  var pieceImage = req.file.originalname;
  var id = req.session.user_id;
  
  var datas = [id,pieceName,pieceContent,d,pieceImage,'/home/4team/4team/svr/duckExpress/public/images'];
  
  dbConnection.query('INSERT INTO piece(member_id,piece_name,piece_content,piece_date,piece_image,piece_image_url) values(?,?,?,?,?,?)',datas, function(err,rows){
        if(err) console.error('query error : '+ err);
        console.log('rows : '+JSON.stringify(rows));

        res.redirect('/gallery');
  });
  console.log(req.file);
});

router.get('/pieces/:piece_code/search',function(req,res){
  var piece_code = req.params.piece_code;

  dbConnection.query('SELECT * FROM goods JOIN member ON goods.member_id=member.member_id JOIN piece ON piece.member_id = member.member_id WHERE piece_code=?',[piece_code],function(err,rows){
    if(err){console.log(err);}

    if(rows[0]==null){
	res.render('search_none');
    }else{
    	res.render('goods_search',{rows:rows});
    	console.log(rows);
    }
  });
});

module.exports = router;
