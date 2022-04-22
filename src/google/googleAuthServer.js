export { handleGoogleAuthResponse, getAuthorizationURL, oauth2Client, validateIdToken };
import { listEvents, postEvents, eventsToPost, isEventsToPostValid } from "./googleCalendar.js";
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library'; //Contructor function from google
const GOOGLE_CLIENT_ID = `564813831875-k9pb4mc6qh31agppeaos7ort3ng16gni.apps.googleusercontent.com`;
const googleClient = new OAuth2Client(`${GOOGLE_CLIENT_ID}`);
import url from 'url';

const oauth2Client = new google.auth.OAuth2(
    '564813831875-k9pb4mc6qh31agppeaos7ort3ng16gni.apps.googleusercontent.com', //client id
    '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', //client secret
    'http://localhost:3000/googleConsent/' //redirect URL
);
const scopes = [
    'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events' //google calendar scopes.
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', //ensures that refresh-token is included in google response.
    scope: scopes,
    include_granted_scopes: true
});

//function that validates idToken
async function validateIdToken(request, response) {
    let idToken = '';
    //On request data, wait for entire idToken
    await request.on('data', (data) => { 
        if (idToken.length > 1e6) {
            alert('Too much');
            request.connection.destroy();
        }
        idToken += data;
    });
    
    let verification = await isIdTokenGoogleVerified(idToken);//verify token with google.

    if (verification == true){ //respond ok to client (token is verified)
            console.log('IdToken accepted!');
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write('Authentication token accepted!');
            response.end();
    } else {
            console.log('IdToken not accepted!'); //respond to client token not verified
            response.writeHead(400, 'BAD REQUEST', { 'Content-Type': 'text/plain' });
            response.write('Authentication token not accepted!');
            response.end();
    }
}

//function checks if idToken is verified at google
async function isIdTokenGoogleVerified(idToken) {
    try { //try to verify idToken at google
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload(); //payload contains all relevant information of user.
        oauth2Client.email = payload.email; //adds email of client to oauth2Client. Enables server to call google calendar api on email.
        oauth2Client.emailID = payload['sub']; //adds emailid to oauth2Client.
        return true;
    } catch (error) { //googleClient.verifyIdToken throws error if google does not verify idToken. 
        console.log("Google did not verify idToken");
        return false;
    }
}

//gets access and refresh tokens that allow for access to GoogleAPIs. Callback from google authorization.
async function handleGoogleAuthResponse(request, response) {
    let obj = url.parse(request.url, true).query;
    if (obj.error) {
        response.writeHead(301, { Location: 'http://localhost:3000/404.html' }); //Redirect to errorpage if user does not consent to share scopes. 
        response.end();
    } else {
        let { tokens } = await oauth2Client.getToken(obj.code);
        oauth2Client.setCredentials(tokens)
        await isIdTokenGoogleVerified(oauth2Client.credentials.id_token);
        response.writeHead(301, { Location: 'http://localhost:3000/form.html' }); //Redirects to the form.html page after the authorization process has happened
        response.end();
        
        if (isEventsToPostValid(eventsToPost)) {
            listEvents();
            postEvents(eventsToPost);
            console.log("Events accepted by server");
        } else {
            console.log("Events was not accepted by server");
        }

    }
}


//function that passes the authorizationURL as the response to redirect on the client-side.
function getAuthorizationURL(request, response) {
    let obj = { url: authorizationUrl };
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(obj)); //stringifies object t
    response.end();
}
