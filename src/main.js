import http from 'http';
import fs from 'fs';
import path from 'path';

const hostname = 'localhost';
const port = 3000;

const publicResources = "./public";

const server = http.createServer((req, res) => {
    let filePath = publicResources + req.url;
    
    if (req.url === '/') {
        filePath = publicResources + '/index.html';
    }

    let contentType = getContentType(filePath);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile(publicResources + '/404.html', function(error, content) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
    
}).listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`)
})


function getContentType(fPath) {
    let extname = String(path.extname(fPath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    return mimeTypes[extname] || 'application/octet-stream';
}

