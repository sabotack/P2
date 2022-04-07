
import http from 'http';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

const hostname = '127.0.0.1';
const port = 3000;

const publicResources = "./public";

const server = http.createServer(function(request, response){

    try{
        processUserRequest(request, response);
    }catch(e){
        console.log("Server error"+e);
        errorResponseUser(request, response);
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

    console.log("GOT: " + request.method + " " + request.url);
    let requestMethod = request.method.toLowerCase();
    console.log(requestMethod)
    
    let filePath = publicResources + request.url;

    switch(requestMethod){
        case 'get':
            switch(request.url){
                case `/favicon.ico`:
                    filePath = publicResources + '/favicon.ico'
                    readFile(filePath, request, response);
                    break;
                case `/`:
                    filePath = publicResources + '/index.html';
                    readFile(filePath, request, response);
                    break;
                case `/index.html`:
                    readFile(filePath, request, response);
                    break;
                case '/login.css':
                    readFile(filePath, request, response);
                    break;
            }
        case 'post':
            switch(request.url){
                case `/message`:
                    
                    let requestBody = '';
                    request.on('data', data => {

                        console.log("Data length= "+data.length);

                        if (data.length > 1e4) { 
                            console.log("Connection Destroyed from user");
                            request.connection.destroy();
                        }

                        requestBody += data;

                    })

                    request.on('end', () => {
                        let parsedData = querystring.decode(requestBody);
                        console.log(parsedData);

                        response.writeHead(200, "OK", {'Content-Type':'text/plain'});
                        response.write('The POST output response: \n\n');
                        response.write(requestBody);
                        response.end("\n\nEnd of message to browser");
                    })

                    break;

            }
    }

}

function validatePOST(request){

    console.log(smt)
}

/*
function dataIncoming(request, response){
    const body = ""
    request.on('data', (chunk) => {
        console.log(chunk);
        body = body + chunk;
    })
    request.on('end', () => {
        res.statusCode = 302;
        res.setHeader('Location', '/'); //Redirect user to homepage
        return res.end();
    });
}
*/

function errorResponseUser(request, response){

    response.statusCode = 500;
    response.writeHead(500, "ERROR", {"Content-Type":"text/plain"});
    response.write("Internal server error");
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