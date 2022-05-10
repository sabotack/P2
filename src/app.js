import http from 'http';
import fs from 'fs';
import path from 'path';
import { locationAPICall } from './rejseplanen/location.js';
import { tripAPICall } from './rejseplanen/trip.js';
import { handleGoogleAuthResponse, writeAuthorizationURL } from './google/googleAuthServer.js';
import { saveEventsOnServer } from './google/googleCalendar.js';

//import https from 'https';

export { server, getContentType };

const publicResources = './public';

const server = http.createServer(function (request, response) {
    try {
        processUserRequest(request, response);
    } catch (e) {
        console.log('Server error' + e);
        errorResponseUser(request, response, e, 500);
    }
});

function processUserRequest(request, response) {
    let requestMethod = request.method.toLowerCase();
    let filePath = publicResources + request.url;

    switch (requestMethod) {
        case 'get':
            if (request.url.startsWith('/googleConsent')) {
                //special case of google redirect where response is included in url
                handleGoogleAuthResponse(request, response); //handles google reponse in url
                break;
            }
            switch (request.url) {
                case `/`:
                    filePath = publicResources + '/index.html';
                    readFile(filePath, request, response);
                    break;
                case `/authorizationRedirect`: //called from client when scopes needs to be accepted
                    writeAuthorizationURL(request, response); //function handles call to endpoint
                    break;
                default:
                    readFile(filePath, request, response);
                    break;
            }
            break;
        case 'post':
            switch (request.url) {
                case '/locationService':
                    locationServiceRequest(request, response);
                    break;
                case '/saveEventsOnServer': //called from client when events is posted to be saved on serverw
                    saveEventsOnServer(request, response); //saves posted events on server-side
                    break;
                case '/tripService':
                    tripServiceRequest(request, response);
                    break;
                default:
                    errorResponseUser(request, response, 'Resource not found', 404);
                    break;
            }
            break;
        default:
            errorResponseUser(request, response, 'Method not allowed', 405);
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
        let parsedData = new URLSearchParams(locationCallPOST);
        parsedData = Object.fromEntries(parsedData);

        locationAPICall(parsedData.location)
            .then((data) => {
                response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
                response.write(JSON.stringify(data));
                response.end();
            })
            .catch((e) => {
                console.log(e);
                const statusCode = e.code !== undefined && e.code > 0 ? e.code : 500;
                response.writeHead(statusCode, e.message, { 'Content-Type': 'text/plain' });
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
        let parsedData = new URLSearchParams(tripCallPOST);
        parsedData = Object.fromEntries(parsedData);

        tripAPICall(parsedData)
            .then((data) => {
                response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
                response.write(JSON.stringify(data));
                response.end();
            })
            .catch((e) => {
                console.log(e);
                const statusCode = e.code !== undefined && e.code > 0 ? e.code : 500;
                response.writeHead(statusCode, e.message, { 'Content-Type': 'text/plain' });
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
