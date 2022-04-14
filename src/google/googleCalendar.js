export { listEvents, postEvents };
import { google } from 'googleapis';
import { oauth2Client } from './googleAuth.js';

//function lists events in given calendar.
function listEvents() {
    const calendar = google.calendar({ version: 'v3' });
    calendar.events.list({
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
    });
}

function postEvents(events) {
    const calendar = google.calendar({ version: 'v3' });
    for (let event in events) {
        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: events[event],
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
        });
    }
}
