/**
 * @file 一个简单的server 提供两个url
 *  只支持get请求
 *  token url:  http://127.0.0.1:10001/token?sid=abc
 *
 *  check url: http://127.0.0.1:10001/check?sid=abc&token=XXXXXX
 *  @author cocoon2007@gmail.com
 */

var http = require('http');
var port = 10001;
var token = require('./token');
var url = require('url');
/**
 * 模拟阻塞的函数
 */
function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
}

function getParam(query, key ) {
    var reg = new RegExp(key + '=(.+?)($|&)'); 
    var matchs = query.match(reg);
    var value = '';
    if (matchs) {
        value = matchs[1];
    }

    return value;
}
var pathHandler = {
    '/token': function (req, res, objUrl) {
        
        var sid = getParam(objUrl.query, 'sid');
        var sToken = token.create(sid);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('token:' + sToken);
    
    },
    '/check': function (req, res, objUrl) {

        var sid = getParam(objUrl.query, 'sid');
        var sToken = getParam(objUrl.query, 'token');
        var result = token.check(sid, sToken);
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end('您的验证结果:' + result);
    
    }
};

/**
 * create a server
 */

http.createServer(function (req, res) {
    var objUrl = url.parse(req.url);
    console.log(objUrl);
     
    var pathname = objUrl.pathname;
    //path处理
    if (pathHandler[pathname]) {
        pathHandler[pathname].call(null, req, res, objUrl);
    }
    else {

        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('not found 404');
    }
  
}).listen(port, '127.0.0.1');

console.log('Server running at http://127.0.0.1:' + port + '/');

