import http from 'http';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import {locationAPICall} from './rejseplanen/location.js';
import {tripAPICall} from './rejseplanen/trip.js';

//import https from 'https';

//Google authentication stuff
import { OAuth2Client } from 'google-auth-library'; //Contructor function from google
const GOOGLE_CLIENT_ID = `949751936924-lm4a4d4kqhv01671h3dihu6gcstjsmv4.apps.googleusercontent.com`; //Google client
const googleClient = new OAuth2Client(`${GOOGLE_CLIENT_ID}`);

const hostname = 'localhost';
const port = 3000;

const publicResources = "./public";

/* OPTIONS FOR HTTPS
let options = {
    key: fs.readFileSync('PRIVATE_KEY_FILE'),
    cert: fs.readFileSync('PUBLIC_KEY_FILE')
};
*/

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
            break;
        case 'post':
            switch(request.url){
                case `/login`:
                    handleGoogleToken(request, response);
                    break;
                case '/create_event':
                    createEventAPICallGC(); // Function will presumably go in another folder
                    // Here will be the case to handle posted event data, presumably a JSON file built and sent from the frontend
                    break;
                case '/locationService':
                    locationServiceRequest(request, response);
                    break;
                /*case '/tripService':
                    tripServiceRequest(request, response);
                    break;*/
                default:
                    errorResponseUser(request, response, "Resource not found", 404);
                    break;
            }
            break;
        default:
            errorResponseUser(request, response, "Bad request", 400);
            break;
    }

}

function locationServiceRequest(request, response){

    let locationCallPOST = '';

    request.on('data', data => {
            
        if (data.length < 1e4) { 
            locationCallPOST += data;

        } else {
            let error = 'Payload too large';
            errorResponseUser(request, response, error, 413);
        }
    });

    request.on('end', () => {
            console.log("form: "+locationCallPOST);
            let parsedData = new URLSearchParams(locationCallPOST);
            parsedData = Object.fromEntries(parsedData);

            locationAPICall(parsedData.location).then(data => {

                response.writeHead(200, "OK", {'Content-Type':'text/plain'});
                response.write(JSON.stringify(data));
                response.end();
            });
    });
}

function tripServiceRequest(request, response){

    let tripCallPOST = '';

    request.on('data', data => {
            
        if (data.length < 1e4) { 
            tripCallPOST += data;

        } else {
            let error = 'Payload too large';
            errorResponseUser(request, response, error, 413);
        }
    });

    request.on('end', () => {
            console.log("form: "+tripCallPOST);
            let parsedData = new URLSearchParams(tripCallPOST);
            parsedData = Object.fromEntries(parsedData);

            tripAPICall(parsedData)
            .then(data => {
                response.writeHead(200, "OK", {'Content-Type':'text/plain'});
                response.write(JSON.stringify(data));
                response.end();
            });
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
                response.end('Internal server error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

function getContentType(fPath) {
    let extensionName = String(path.extname(fPath)).toLowerCase();
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

    return mimeTypes[extensionName] || 'application/octet-stream';
}

function createEventAPICallGC(){

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