/**
 *
 * 生成二维码
 */

/**
 * 生成二维码
 * @param {Object} options
 */
var arcode = require('qrcode');

var Canvas = require('Canvas');

var QRCodeAlg = arcode;

var qrcodeAlgObjCache = [];


function create(opt) {
    opt.height = 200;
    opt.width = 300;

	//设置默认参数
	var options = {
		text: opt.text,
		render: "",
		width: opt.width,
		height: opt.height,
		correctLevel: 3,
		background: "#ffffff",
		foreground: "#000000"
	};

	//使用QRCodeAlg创建二维码结构
	var qrCodeAlg = null;
	for(var i = 0, l = qrcodeAlgObjCache.length; i < l; i++){
		if(qrcodeAlgObjCache[i].text == this.options.text && qrcodeAlgObjCache[i].text.correctLevel == this.options.correctLevel){
			qrCodeAlg = qrcodeAlgObjCache[i].obj;
			break;
		}
	}
	if(i == l){
	  qrCodeAlg = new QRCodeAlg(options.text, options.correctLevel);
	  qrcodeAlgObjCache.push({text: options.text, correctLevel: options.correctLevel, obj:qrCodeAlg});
	}
    
    return createCanvas(qrCodeAlg);

}


function createCanvas (qrCodeAlg, options) {
	//创建canvas节点
	var canvas = new Canvas('canvas');
	canvas.width = options.width;
	canvas.height = options.height;
	var ctx = canvas.getContext('2d');

	//计算每个点的长宽
	var tileW = (this.options.width / qrCodeAlg.getModuleCount()).toPrecision(4);
	var tileH = this.options.height / qrCodeAlg.getModuleCount().toPrecision(4);

	//绘制
	for (var row = 0; row < qrCodeAlg.getModuleCount(); row++) {
		for (var col = 0; col < qrCodeAlg.getModuleCount(); col++) {
			ctx.fillStyle = qrCodeAlg.modules[row][ col] ? this.options.foreground : this.options.background;
			var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
			var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
			ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
		}
	}
	//返回绘制的节点
	return canvas;
};

exports.create = create;
