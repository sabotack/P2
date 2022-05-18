export { postEvents, saveEventsOnServer, eventsToPost };
import { google } from 'googleapis';
import { oauth2Client } from './googleAuthServer.js';
import { validateEventsObj } from '../validation.js';

let eventsToPost;

//function that saves and validates event on the server-side
async function saveEventsOnServer(request, response) {
    let jsonString;
    let isEventsValid;
    let testString;

    //awaits the request data to avoid missing data in the upcomming validation
    await request.on('data', (data) => {
        testString = data;
    });

    request.on('end', async () => {
        try {
            jsonString = JSON.parse(testString);
            eventsToPost = jsonString;
            //returns true or false and is used to control wheter the server accepts or rejects the events
            isEventsValid = await validateEventsObj(eventsToPost);
        } catch (e) {
            console.log(e);
            isEventsValid = false;
        }

        //if the events are valid the response is OK and the events are stored
        if (isEventsValid) {
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write(JSON.stringify({ body: 'events stored at server' }));
            response.end();
            console.log('Events accepted by server');
            //else the events are rejected and the body returns false
        } else {
            eventsToPost = '';
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write(JSON.stringify({ body: false }));
            response.end();
            console.log('Events was not accepted by server');
        }
    });
}

//function that posts an array of events to the newly logged-in user
function postEvents(events) {
    const calendar = google.calendar({ version: 'v3' }); //creates calendar object from googleapis package.
    for (let event in events) {
        //loops throug events in event-array
        if (events[event] != null) {
            calendar.events.insert(
                //inserts an event in calendar.
                {
                    auth: oauth2Client, //auth constant (now containing id-, access and refresh token.)
                    calendarId: 'primary', //posts events to primary calendar of user that logged in.
                    resource: events[event] //event to be posted
                },
                function (err, event) {
                    //if error posting to google calendar.
                    if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                    }
                }
            );
        }
    }
}
