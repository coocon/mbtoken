/**
 * @file 一个简单的server 提供两个url
 *  只支持get请求
 *  token url:  http://127.0.0.1:10001/token?sid=abc
 *
 *  check url: http://127.0.0.1:10001/check?sid=abc&token=XXXXXX
 *  @author cocoon2007@gmail.com
 */

var http = require('http');
var port = 8010;
var token = require('./token');
var url = require('url');

var fs = require('fs');
var modStatic = require('./static');

var loginList = {};

//二维码处理模块
var img = require('./img');
var ip = require('node-ip');

var localIp = '127.0.0.1';

/**
 * 模拟阻塞的函数
 */
function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
}

/**
 * 从query中获得参数
 * @param {string} query    url中的query
 * @param {string} key   query中的key
 *
 * return {string} 返回值 value
 */
function getParam(query, key) {
    var reg = new RegExp(key + '=(.+?)($|&)'); 
    var matchs = query.match(reg);
    var value = '';
    if (matchs) {
        value = matchs[1];
    }

    return value;
}
/**
 * path的处理函数
 */
var pathHandler = {
    '/token': function (req, res, objUrl) {
        
        var sid = getParam(objUrl.query, 'sid');
        var sToken = token.create(sid);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('token:' + sToken);
    
    },
    '/tokenimg': function (req, res, objUrl) {
        
        var sid = getParam(objUrl.query, 'sid');
        var sToken = token.create(sid);
        res.writeHead(200, {'Content-Type': 'image/png'});
        var urlAuth = '/check?sid=' + sid + '&token=' + sToken;

        localIp = ip.address();
        var prefix = 'http://' + localIp + ':' + port;

        urlAuth = prefix + urlAuth;
        var content = img.create({ text: urlAuth });

        console.log(urlAuth);
        res.write(content);
        res.end();
    
    },
    /**
     * 告诉页面 他是否已经登录了
     */
    '/pull': function (req, res, objUrl) {

        var sid = getParam(objUrl.query, 'sid');
        var result = false;

        if (loginList[sid]) {
            result = true;
        }
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

        res.end('{"result": ' + result + '}' );
    
    },
    '/lasttime': function (req, res, objUrl) {
        var sid = getParam(objUrl.query, 'sid');

        var lastTime = token.getLastTime(sid);

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

        res.end('{"lastTime": ' + lastTime + '}' );

    },
    '/check': function (req, res, objUrl) {

        var sid = getParam(objUrl.query, 'sid');
        var sToken = getParam(objUrl.query, 'token');
        var result = token.check(sid, sToken);
        if (result) {
            loginList[sid] = new Date(); 
        }
        else {
            loginList[sid] = null; 
        }
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end('您的验证结果:' + result);
    
    }
};

/**
 * create a server
 */

var regStatic = /^(?:\/).+(html|css|png|gif|js)$/;

http.createServer(function (req, res) {
    var objUrl = url.parse(req.url);
    //console.log(objUrl);
     
    var pathname = objUrl.pathname;

    objUrl.query = decodeURIComponent(objUrl.query || '');

    var resFile = null;
    // 可以匹配到 处理函数 就用pathHanlder处理
    if (pathHandler[pathname]) {
        pathHandler[pathname].call(null, req, res, objUrl);
    }
    else {

        resFile = pathname.match(regStatic);
        resFile = resFile && resFile[0].replace(/^\//, '');
        //static files 处理
        if (resFile) {
            modStatic.handle(req, res, resFile ); 
        }
        //404 lala...
        else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('not found 404');
        }
    }
  
}).listen(port, '0.0.0.0');

console.log('Server running at' + localIp +':' + port + '/');

