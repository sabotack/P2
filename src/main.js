import http from 'http';
import fs from 'fs';
import path from 'path';

const hostname = '127.0.0.1';
const port = 3001;

const publicResources = "./public";

const server = http.createServer(function(request, response){

    try{
        processUserRequest(request, response);
    }catch(e){
        console.log("Server error"+e);
        errorResponseUser(request, response, e, 500);
    }
    
});

server.listen(port, function(){
    console.log(`Server running on http://${hostname}:${port}/`);
});

/*
let filePath = publicResources + request.url;
let method = request.method;
console.log(`method = `+method);
*/

/*if (request.url === '/') {
        filePath = publicResources + '/index.html';
    }*/

function processUserRequest(request, response){
    
    let requestMethod = request.method.toLowerCase();
    
    let filePath = publicResources + request.url;

    switch(requestMethod){
        case 'get':
            switch(request.url){
                case `/`:
                    filePath = publicResources + '/index.html';
                    readFile(filePath, request, response);
                    break;
                default:
                    readFile(filePath, request, response);
                    break;
            }
        case 'post':
            switch(request.url){
                default:
                    validatePOST(request, response);
                    break;
            }
    }

}

function validatePOST(request, response){

    let requestBody = '';

    request.on('data', data => {
            
        if (data.length < 1e4) { 
            requestBody += data;

        } else {
            let error = 'Payload too large';
            errorResponseUser(request, response, error, 413);
        }
    });

    request.on('end', () => {
        if (requestBody != 0){

            let parsedData = new URLSearchParams(requestBody);
            parsedData = Object.fromEntries(parsedData);

            console.log(parsedData);
            response.writeHead(200, "OK", {'Content-Type':'text/plain'});
            response.write('The POST output response: \n\n');
            response.write(requestBody);
            response.end("\n\nEnd of message to browser");

            return requestBody;
        }
    });

}

function errorResponseUser(request, response, error, errorCode){

    response.writeHead(errorCode, "Error", {"Content-Type":"text/plain"});
    response.write("Error: "+error+"\n\nError code: "+errorCode);
    response.end();

}

function readFile(filePath, request, response){

    let contentType = getContentType(filePath);
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile(publicResources + '/404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

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
        '.ico': 'image/x-icon',
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