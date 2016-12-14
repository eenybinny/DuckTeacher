var express = require('express');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();

var client = mysql.createConnection({
   host:'localhost',
   port:'3306',
   user:'4team',
   password:'gachon654321',
   database:'4team'
});

/* GET home page. */
router.get('/',function(req,res){
   res.render('login_super'); 
});

/* POST home page. */
router.post('/',function(req,res){
    //Request params
    var superid = req.body.superid;
    var superpw = req.body.superpw;
    console.log(superid,superpw);
    
    var dbid, dbpw;
    //Read database
    client.query('SELECT * FROM super',function(error,results){
        for(var i=0;i<results.length;i++){
            if(results[i].super_id==superid){
                dbid=results[i].super_id;
                dbpw=results[i].super_pw;
                console.log(dbid,dbpw);
                
                //ID,PW Check!
                if(superid==dbid && superpw==dbpw){
                    //express-session에 저장!
                    req.session.super_id = superid;
                    res.redirect('../super/');
                }else{
                    //ALERT!
                    res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8"});
                    res.write("<html><body><script>alert('아이디와비밀번호가일치하지않습니다!');history.go(-1);</script></body></html>");
                    res.end();
                }
            }else{
                //ALERT!
                res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8"});
                res.write("<html><body><script>alert('등록되지 않은 아이디입니다!');history.go(-1);</script></body></html>");
                res.end();
            }
        }
    });
});

module.exports = router;