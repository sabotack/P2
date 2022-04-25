export { listEvents, postEvents, saveEventsOnServer, eventsToPost, isEventsToPostValid };
import { google } from 'googleapis';
import { oauth2Client } from './googleAuthServer.js';

let eventsToPost = '';

//function lists events in given calendar.
function listEvents() {
    const calendar = google.calendar({ version: 'v3' });
    calendar.events.list(
        {
            auth: oauth2Client,
            calendarId: oauth2Client.email,
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        },
        (err, res) => {
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
        }
    );
}

async function saveEventsOnServer(request, response) {
    let jsonString;
    request.on('data', function (data) {
        jsonString = JSON.parse(data);
        eventsToPost = jsonString;
    });

    request.on('end', () => {
        if (isEventsToPostValid(eventsToPost)) {
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write(JSON.stringify({ body: 'events stored at server' }));
            response.end();
            console.log('Events accepted by server');
        } else {
            eventsToPost = "";
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.write(JSON.stringify({ body: false }));
            response.end();
            console.log('Events was not accepted by server');
        }
        
    });
}

function isEventsToPostValid(events) {
    return true;
}

//function that posts an array of events to the newly logged-in user
function postEvents(events) {
    console.log(events);
    const calendar = google.calendar({ version: 'v3' });
    for (let event in events) {
        calendar.events.insert(
            {
                auth: oauth2Client,
                calendarId: 'primary',
                resource: events[event]
            },
            function (err, event) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
            }
        );
    }
}
