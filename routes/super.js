var express = require('express');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var router = express.Router();

var client = mysql.createConnection({
   host:'localhost',
   port:'3306',
   user:'4team',
   password:'gachon654321',
   database:'4team',
   multipleStatements: true
});

/*세션 체크*/
router.use(function(req,res,next){
    if(req.session.super_id){
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
router.get('/',function(req,res){
    
    /* 누적 작품 게시량 */
    var jsonData, jsonData2 = '';
    
    var baseday = moment();
    baseday = baseday.subtract(30,'days');
    baseday = baseday.format('YYYY-MM-DD');
    
    var allQuery = '';
    var query = 'SELECT * FROM piece WHERE piece_date >= '+"'"+baseday+"'";
    
    /*muliquery문 생성*/
   for(var i=0;i<30;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery = allQuery + query +'AND piece_date <='+'"'+limitDay+'"'+';';
   }
    allQuery = allQuery.substring(0,allQuery.length-1);

   var countList = new Array();
   var List = new Array();

   client.query(allQuery,function(error,results){
       for(var i=0;i<results.length;i++){
          countList.push(results[i].length);
        }
       for(var i=0;i<30;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList[i];
           List.push(obj);
       }
       jsonData = JSON.stringify(List);
   });
    
    /*누적 제품 게시량*/
    var allQuery2 = '';
    var query2 = 'SELECT * FROM goods WHERE goods_date >= '+"'"+baseday+"'";
    
    /*muliquery문 생성*/
   for(var i=0;i<30;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery2 = allQuery2 + query2 +'AND goods_date <='+'"'+limitDay+'"'+';';
   }
    allQuery2 = allQuery2.substring(0,allQuery2.length-1);

   var countList2 = new Array();
   var List2 = new Array();

   client.query(allQuery2,function(error,results){
       for(var i=0;i<results.length;i++){
          countList2.push(results[i].length);
        }
       for(var i=0;i<30;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList2[i];
           List2.push(obj);
       }
       jsonData2 = JSON.stringify(List2);
       res.render('super_home',{galleryData:jsonData,martketData:jsonData2});
   });
});

router.get('/gallery',function(req,res){
   var allQuery = '';
   var query = 'SELECT * FROM piece WHERE piece_date = '
   var jsonData, jsonData2, jsonData3;
    
   /* 일별 작품 게시량 */
   for(var i=0;i<7;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery = allQuery + query +'"'+limitDay+'"'+';';
   }
   allQuery = allQuery.substring(0,allQuery.length-1);

   var countList = new Array();
   var List = new Array();

   client.query(allQuery,function(error,results){
       for(var i=0;i<results.length;i++){
          countList.push(results[i].length);
        }
       for(var i=0;i<7;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList[i];
           List.push(obj);
       }
       
       jsonData = JSON.stringify(List);
});
    
    /* 월별 작품 게시량 */
    var allQuery2 = '';
    
    for(var i=0;i<30;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery2 = allQuery2 + query +'"'+limitDay+'"'+';';
   }
   allQuery2 = allQuery2.substring(0,allQuery2.length-1);
    
    var countList1 = new Array();
    var List1 = new Array();
    
    client.query(allQuery2,function(error,results){
       for(var i=0;i<results.length;i++){
          countList1.push(results[i].length);
        }
       for(var i=0;i<30;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList1[i];
           List1.push(obj);
       }
       jsonData2 = JSON.stringify(List1);
});
    
    /* 누적 작품 게시량 */
    var baseday = moment();
    baseday = baseday.subtract(30,'days');
    baseday = baseday.format('YYYY-MM-DD');
    
    var allQuery3 = '';
    var query1 = 'SELECT * FROM piece WHERE piece_date >= '+"'"+baseday+"'";
    
    /*muliquery문 생성*/
   for(var i=0;i<30;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery3 = allQuery3 + query1 +'AND piece_date <='+'"'+limitDay+'"'+';';
   }
    allQuery3 = allQuery3.substring(0,allQuery3.length-1);

   var countList2 = new Array();
   var List2 = new Array();

   client.query(allQuery3,function(error,results2){
       for(var i=0;i<results2.length;i++){
           countList2.push(results2[i].length);
        }
       for(var i=0;i<30;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList2[i];
           List2.push(obj);
       }
       jsonData3 = JSON.stringify(List2);
       res.render('super_gallery',{dayData:jsonData,monthData:jsonData2,totalData:jsonData3});
   });
});

router.get('/market',function(req,res){
    
   var allQuery = '';
   var query = 'SELECT * FROM goods WHERE goods_date = '
   var jsonData, jsonData2, jsonData3;
    
   /* 일별 상품 게시량 */
   for(var i=0;i<7;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery = allQuery + query +'"'+limitDay+'"'+';';
   }
   allQuery = allQuery.substring(0,allQuery.length-1);

   var countList = new Array();
   var List = new Array();

   client.query(allQuery,function(error,results){
       for(var i=0;i<results.length;i++){
          countList.push(results[i].length);
        }
       for(var i=0;i<7;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList[i];
           List.push(obj);
       }
       
       jsonData = JSON.stringify(List);
});
    
    /* 월별 상품 게시량 */
    var allQuery2 = '';
    
    for(var i=0;i<30;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery2 = allQuery2 + query +'"'+limitDay+'"'+';';
   }
   allQuery2 = allQuery2.substring(0,allQuery2.length-1);
    
    var countList1 = new Array();
    var List1 = new Array();
    
    client.query(allQuery2,function(error,results){
       for(var i=0;i<results.length;i++){
          countList1.push(results[i].length);
        }
       for(var i=0;i<30;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList1[i];
           List1.push(obj);
       }
       
       jsonData2 = JSON.stringify(List1);
});
    
     /* 누적 작품 게시량 */
    var baseday = moment();
    baseday = baseday.subtract(30,'days');
    baseday = baseday.format('YYYY-MM-DD');
    
    var allQuery3 = '';
    var query1 = 'SELECT * FROM piece WHERE piece_date >= '+"'"+baseday+"'";
    
    /*muliquery문 생성*/
   for(var i=0;i<30;i++){
     var limitDay = moment();
     limitDay = limitDay.subtract(i,'days');
     limitDay = limitDay.format('YYYY-MM-DD');
     allQuery3 = allQuery3 + query1 +'AND piece_date <='+'"'+limitDay+'"'+';';
   }
    allQuery3 = allQuery3.substring(0,allQuery3.length-1);

   var countList2 = new Array();
   var List2 = new Array();

   client.query(allQuery3,function(error,results2){
       for(var i=0;i<results2.length;i++){
           countList2.push(results2[i].length);
        }
       for(var i=0;i<30;i++){
           var obj = new Object();
           var limitDay = moment();
           limitDay = limitDay.subtract(i,'days');
           limitDay = limitDay.format('YYYY-MM-DD');
           obj.x = limitDay;
           obj.y = countList2[i];
           List2.push(obj);
       }
       jsonData3 = JSON.stringify(List2);
       res.render('super_market',{dayData:jsonData,monthData:jsonData2,totalData:jsonData3});
   });
    
});

router.get('/account',function(req,res){
    client.query('SELECT * FROM member',function(error,results){
       res.render('super_account', {data: results});  
    });
});

router.get('/account/edit/:member_id',function(req,res){
    client.query('SELECT * FROM member WHERE member_id = ?',[req.params.member_id],function(error,result){
       res.render('super_account_edit',{item: result[0]}); 
    });
});

router.post('/account/edit/:member_id',function(req,res){
    var userid = req.params.member_id;
    var body = req.body;
    
    client.query('UPDATE member SET member_nick=?, member_name=?, member_email=? WHERE member_id=?',[body.usernick,body.username,body.useremail,userid],function(){
       res.redirect('/super/account'); 
    });
});

router.get('/account/delete/:member_id',function(req,res){
   client.query('DELETE FROM member WHERE member_id=?',[req.params.member_id],function(){
       //ALERT!
        res.writeHeader(200, {"Content-Type": "text/html; charset = utf-8" });
        res.write("<html><body><script>alert('삭제되었습니다!'); location='/super/account'</script></body></html>");
        res.end();
   });
});

router.get('/info',function(req,res){
    res.render('super_myAccount');
});

router.post('/info',function(req,res){
    //Request param
    var newpw1 = req.body.newpw1;
    var newpw2 = req.body.newpw2;
    
    //Get Session id
    var superID = req.session.super_id;
    
    if(newpw1==newpw2){
        //DB QUERY
        client.query('UPDATE super SET super_pw=? WHERE super_id=?',[newpw1,superID],function(){
            //ALERT!
            res.writeHeader(200, {"Content-Type": "text/html; charset = utf-8", });
            res.write("<html><body><script>alert('비밀번호가수정되었습니다!');history.go(-1);</script></body></html>");
            res.end();
        });
    }else{
        //ALERT!
        res.writeHeader(200, {"Content-Type": "text/html; charset = utf-8", });
        res.write("<html><body><script>alert('비밀번호가 다릅니다!');history.go(-1);</script></body></html>");
        res.end();
    }
});

router.get('/logout',function(req,res){
        //Session Destroy
        req.session.destroy(function(err){
        res.redirect('../');
        });
});

module.exports = router;
