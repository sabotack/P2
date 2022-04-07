import http from 'http';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';


//Google authentication stuff
import { OAuth2Client } from 'google-auth-library'; //Contructor function from google
const GOOGLE_CLIENT_ID = `949751936924-lm4a4d4kqhv01671h3dihu6gcstjsmv4.apps.googleusercontent.com`; //Google client
const googleClient = new OAuth2Client(`${GOOGLE_CLIENT_ID}`);


const hostname = 'localhost';
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

function processUserRequest(request, response){

    console.log("GOT: " + request.method + " " + request.url);
    let requestMethod = request.method.toLowerCase();
    console.log(requestMethod)
    
    let filePath = publicResources + request.url;
    console.log(request.url);

    switch(requestMethod){
        case 'get':
            switch(request.url){
                case `/`:
                    console.log("/ case");
                    filePath = publicResources + '/index.html';
                    readFile(filePath, request, response);
                    break;
                case `/index.html`:
                    console.log("index case");
                    readFile(filePath, request, response);
                    break;
                case '/login.css':
                    console.log("css case");
                    readFile(filePath, request, response);
                    break;
                case '/googleAuth.js':
                    console.log("googleAuth case");
                    readFile(filePath, request, response);
                    break;
            }
        case 'post':
            switch(request.url){
                case `/message`:
                    console.log("POST CASE MESSAGE");
                    
                    let requestBody = '';
                    request.on('data', data => {
                        
                        if (requestBody.length > 1e6) { 
                            alert("Too much");
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
                case `/login`:
                    handleGoogleToken(request, response);
                    break;
            }
    }

}

function validatePOST(request){

    console.log(smt)
}

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

function handleGoogleToken(request, response) {
    let token = '';
    request.on('data', data => {
        if (token.length > 1e6) { 
            alert("Too much");
            request.connection.destroy();
        }
        token += data;
        verifyGoogleAccount(token).catch(console.error);
    })

    request.on('end',() => {
        console.log("Login accessed");
        response.writeHead(200, "OK", {'Content-Type':'text/plain'});
        response.write('The POST output response: \n\n');
        response.write(token);
        response.end("\n\nEnd");
    })
}

async function verifyGoogleAccount(token) {
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload);
}
