/**
 * 二维码生成器
 */

var iconv = require('./lib/iconv.js');
var qrcode = require('./lib/qrcode.js');



/**
 * 生成二维码
 * @param {Object} opt
 */
function create(opt) {

    var str = opt.text || '';

    opt.height = 200;
    opt.width = 300;

    var qr = qrcode.qrcode(4, 'M');
	qr.addData(str);  
	qr.make();

	var base64 = qr.createImgTag(5, 10);  // 获取base64编码图片字符串

	base64 = base64.match(/src="([^"]*)"/)[1];  // 获取图片src数据
    base64 = base64.replace(/^data:image\/\w+;base64,/, '');  // 获取base64编码
    base64 = new Buffer(base64, 'base64');  // 新建base64图片缓存
	
    return base64;

}

exports.create = create;
