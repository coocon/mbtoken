/**
 *
 * 基于时间的token
 */

var fs = require('fs');

function handle(req, res, resFile) {
    //read files
    fs.readFile(resFile, function (err, data) {
    
        /*
        res.writeHead(200, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain' });
            */
        if (err) {
            console.log('err', err); 
        }
        else {
        res.write(data);
        }
        res.end();
    });     

}

exports.handle = handle;
