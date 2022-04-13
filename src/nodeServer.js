import http from 'http';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import {locationAPICall} from './rejseplanen/location.js';
import {tripAPICall} from './rejseplanen/trip.js';

//import https from 'https';

//Google authentication stuff
import { OAuth2Client } from 'google-auth-library'; //Contructor function from google
const GOOGLE_CLIENT_ID = `564813831875-k9pb4mc6qh31agppeaos7ort3ng16gni.apps.googleusercontent.com`; 
const googleClient = new OAuth2Client(`${GOOGLE_CLIENT_ID}`);
import { google } from 'googleapis';
import url from 'url';

export { server, getContentType };

const hostname = 'localhost';
const port = 3000;
const oauth2Client = new google.auth.OAuth2(
  '564813831875-k9pb4mc6qh31agppeaos7ort3ng16gni.apps.googleusercontent.com', //client id
  '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', //client secret
  'http://localhost:3000/googleConsent/' //redirect URL
);
const scopes = [
  'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events' //google calendar scopes. 
];
const publicResources = "./public";

/* OPTIONS FOR HTTPS
let options = {
    key: fs.readFileSync('PRIVATE_KEY_FILE'),
    cert: fs.readFileSync('PUBLIC_KEY_FILE')
};
*/

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', //ensures that refresh-token is included in google response.
  scope: scopes,
  include_granted_scopes: true
});

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
            if(request.url.startsWith('/googleConsent')) { //special case of google redirect where response is included in url
                getAccessAndRefreshToken(request, response); //handles the redirect from google's authorization page where scopse are accepted.
                break;
            }
            switch(request.url){
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
            switch(request.url){
                case `/validateIdToken`:
                    validateIdToken(request, response);
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

//function validates an idToken and 
function validateIdToken(request, response) {
    let idToken = '';
    request.on('data', data => {
        if (idToken.length > 1e6) { 
            alert("Too much");
            request.connection.destroy();
        }
        idToken += data;
        verifyTokenAtGoogle(idToken).catch(console.error); //verify token with google.
    });

    request.on('end',() => {
        console.log("Login accessed");
        response.writeHead(200, "OK", {'Content-Type':'text/plain'});
        response.write('The POST output response: \n\n');
        response.write(authorizationUrl+"\n");
        response.end();
    });
}

//function verifies idToken with google
async function verifyTokenAtGoogle(idToken) {
    const ticket = await googleClient.verifyIdToken({
        idToken: idToken,
        audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); //payload contains all relevant information of user.
    const userid = payload['sub']; 
    oauth2Client.email = payload.email; //adds email of client to oauth2Client. Enables server to call google calendar api on email.
}

//gets access and refresh tokens that allow for access to GoogleAPIs
async function getAccessAndRefreshToken(request, response) {
  let obj = url.parse(request.url, true).query;
  let { tokens } = await oauth2Client.getToken(obj.code);
  oauth2Client.setCredentials(tokens);
  response.writeHead(301, { "Location": "http://localhost:3000/form.html" }); //Redirects to the form.html page after the authorization process has happened
  response.end();
}

//function lists events in given calendar.
function listEvents() {
    const calendar = google.calendar({version: 'v3'});
    calendar.events.list({
      auth: oauth2Client,
      calendarId: oauth2Client.email,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
}

//function generates authorization URL and passes it as response.
function getAuthorizationURL(request, response) {
  let obj = {url: authorizationUrl};
  console.log("googleRedirect");
  response.writeHead(200, { 'Content-Type': 'application/json' });
  console.log(obj);
  response.write(JSON.stringify(obj)); //stringifies object t
  response.end();
}
