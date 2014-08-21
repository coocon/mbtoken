/**
 *
 * 基于时间的token
 */

var crypto = require('crypto');
//时间间隔ms
var TIME_SPAN = 30000;
//盐巴
var SALT = 'COOCON';

var SID = 'SID_SID';

var SMALL_TIME = 5;
var BIG_TIME = 35;

var TOKEN_LENGTH = 6;

//token的字典
var tokenList = {};
//过期时间字典
var timeList = {};


/**
 * 基于时间，半分钟内不会变 00--30, 30-60 两个区间
 */
function getBasedTime() {
    var time = new Date();
    if (time.getSeconds() < 30) {
       time.setSeconds(SMALL_TIME);  
    }
    else {
       time.setSeconds(BIG_TIME);  
    }

    time.setMilliseconds(0);
    return time.getTime() + '';

}
/**
 * 产生token
 * @param {number} timeSpan 时间间隔
 * @param {string} sid  增加一个变量sid
 *
 * @return {string} 返回的token
 */
function createToken(sid, timeSpan) {
    timeSpan = timeSpan || TIME_SPAN;
    sid = sid || SID;

    var strTime = getBasedTime();
    var shasum = crypto.createHash('sha1'); 
     // add salt  
    sid += SALT;

    shasum.update(sid);
    shasum.update(strTime);
    var token = shasum.digest('hex');
    
    return token;
}
/**
 * 将hex的token 转为大家喜欢的数字
 */
function transformToken(tokenHex) {
    var str = '';
    for ( var i = 0; i < TOKEN_LENGTH; i++) {
    
        str += tokenHex[i].charCodeAt() % 10;
    }
    return str;
}

function create(sid, timeSpan) {

    var hex = createToken(sid, timeSpan);
    var token  = transformToken(hex);
    tokenList[sid] = token;
    timeList[sid] = new Date().getTime() + TIME_SPAN ;

    return token;
}

/**
 * check sid和token是否匹配
 */
function check(sid, token) {
    var result = false;

    if (tokenList[sid] == token) {
        result = true; 
    }
    console.log('tokenList:', tokenList, 'sid:' + sid, 'token:', token, result);
    return result;
}

/**
 *
 */
function getLastTime(sid) {

    var expiresTime = timeList[sid];
    var left = 0;
    var now = new Date().getTime();
    if (expiresTime && expiresTime - now > 0) {
        left = ((expiresTime - now) / 1000 ) | 0;
    }
    
    return left;
}

exports.create = create;
exports.check = check;
exports.getLastTime = getLastTime;
