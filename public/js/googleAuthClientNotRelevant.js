// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '564813831875-k9pb4mc6qh31agppeaos7ort3ng16gni.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'];
import jwt_decode from 'jwt-decode';

function checkAuth() {
    gapi.auth.authorize(
        {
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: true
        },
        handleAuthResult
    );
}

function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
        //postEvents(testEvents);
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

function handleAuthClick(event) {
    console.log('test');
    let user = jwt_decode(event.credential);

    console.log(user.credential.payload.email);
    gapi.auth.authorize({ client_id: CLIENT_ID, scope: SCOPES, immediate: false }, handleAuthResult);
    return false;
}

function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

function listCalendars() {
    var request = gapi.client.calendar.calendarList.list();

    request.execute(function (resp) {
        var cals = resp.items;
        appendPre('Your calendars:');

        if (cals.length > 0) {
            for (i = 0; i < cals.length; i++) {
                var calendar = cals[i];

                appendPre(calendar.summary + ' (' + calendar.id + ')');
            }
        } else {
            appendPre('No calendars found.');
        }
    });
}

function listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
        calendarId: 'primary' /* Can be 'primary' or a given calendarid */,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 30,
        orderBy: 'startTime'
    });

    request.execute(function (resp) {
        var events = resp.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')');
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}

function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

//function that posts an array of events to the newly logged-in user
function postEvents(events) {
    //const calendar = google.calendar({ version: 'v3' });
    for (let event in events) {
        gapi.client.events.insert(
            {
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

const testEvents = [
    {
        summary: 'Google I/O 2015',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-04-15T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-04-15T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    },
    {
        summary: 'Anders mongol',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-04-16T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-04-16T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    }
];
