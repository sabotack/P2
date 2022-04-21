import http from 'http';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { locationAPICall } from './rejseplanen/location.js';
import { tripAPICall } from './rejseplanen/trip.js';
import { getAccessAndRefreshToken, getAuthorizationURL, validateIdToken } from './google/googleAuthServer.js';
import { googleCalendarPost} from './google/googleCalendar.js';
//import https from 'https';

export { server, getContentType };

const hostname = 'localhost';
const port = 3000;
const publicResources = './public';

/* OPTIONS FOR HTTPS
let options = {
    key: fs.readFileSync('PRIVATE_KEY_FILE'),
    cert: fs.readFileSync('PUBLIC_KEY_FILE')
};
*/

const server = http.createServer(function (request, response) {
    try {
        processUserRequest(request, response);
    } catch (e) {
        console.log('Server error' + e);
        errorResponseUser(request, response, e, 500);
    }
});

server.listen(port, function () {
    console.log(`Server running on http://${hostname}:${port}/`);
});

function processUserRequest(request, response) {
    let requestMethod = request.method.toLowerCase();
    let filePath = publicResources + request.url;

    switch (requestMethod) {
        case 'get':
            if (request.url.startsWith('/googleConsent')) {
                //special case of google redirect where response is included in url
                getAccessAndRefreshToken(request, response); //handles the redirect from google's authorization page where scopes are accepted.
                break;
            }
            switch (request.url) {
                case `/`:
                    filePath = publicResources + '/index.html';
                    readFile(filePath, request, response);
                    break;
                case `/authorizationRedirect`: //called from client when scopes needs to be accepted
                    getAuthorizationURL(request, response);
                    break;
                default:
                    readFile(filePath, request, response);
                    break;
            }
            break;
        case 'post':
            switch (request.url) {
                case `/validateIdToken`: //currently not used due to conflicts with double login-screens
                    validateIdToken(request, response);
                    break;
                case '/create_event':
                    createEventAPICallGC(); // Function will presumably go in another folder
                    // Here will be the case to handle posted event data, presumably a JSON file built and sent from the frontend
                    break;
                case '/locationService':
                    locationServiceRequest(request, response);
                    break;
                case '/GoogleCalendarPost':
                    googleCalendarPost(request, response);
                    break;
                /*case '/tripService':
                    tripServiceRequest(request, response);
                    break;*/
                default:
                    errorResponseUser(request, response, 'Resource not found', 404);
                    break;
            }
            break;
        default:
            errorResponseUser(request, response, 'Bad request', 400);
            break;
    }
}

function locationServiceRequest(request, response) {
    let locationCallPOST = '';

    request.on('data', (data) => {
        if (data.length < 1e4) {
            locationCallPOST += data;
        } else {
            let error = 'Payload too large';
            errorResponseUser(request, response, error, 413);
        }
    });

    request.on('end', () => {
        console.log('form: ' + locationCallPOST);
        let parsedData = new URLSearchParams(locationCallPOST);
        parsedData = Object.fromEntries(parsedData);

        locationAPICall(parsedData.location).then((data) => {
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write(JSON.stringify(data));
            response.end();
        });
    });
}

function tripServiceRequest(request, response) {
    let tripCallPOST = '';

    request.on('data', (data) => {
        if (data.length < 1e4) {
            tripCallPOST += data;
        } else {
            let error = 'Payload too large';
            errorResponseUser(request, response, error, 413);
        }
    });

    request.on('end', () => {
        console.log('form: ' + tripCallPOST);
        let parsedData = new URLSearchParams(tripCallPOST);
        parsedData = Object.fromEntries(parsedData);

        tripAPICall(parsedData).then((data) => {
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write(JSON.stringify(data));
            response.end();
        });
    });
}

function errorResponseUser(request, response, error, errorCode) {
    response.writeHead(errorCode, 'Error', { 'Content-Type': 'text/plain' });
    response.write('Error: ' + error + '\n\nError code: ' + errorCode);
    response.end();
}

function readFile(filePath, request, response) {
    let contentType = getContentType(filePath);
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile(publicResources + '/404.html', function (error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Internal server error: ' + error.code + ' ..\n');
            }
        } else {
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

function createEventAPICallGC() {}
