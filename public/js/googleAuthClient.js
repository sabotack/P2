export { submitForm };

async function submitForm(events) {
    let eventsIsAccepted = await validateEventsObj(events);
    if (eventsIsAccepted.isValid == false) {
        window.alert(eventsIsAccepted.comment);
    } else {
        saveAndValidateEventsOnServer(events).then((eventsIsValid) => {
            console.log(eventsIsValid.body);
            if (eventsIsValid.body == false) {
                window.alert('Server did not accept submitted event');
            } else {
                handleGoogleAuth();
            }
        });
    }
}

async function createEventsObj() {
    let testEvents = [];
    testEvents[1] = {
        summary: 'GG',
        location: '800 Howard St., San Francisco, CA 94103',
        description: '<h1>Test</h1> test',
        colorId: '7',
        start: {
            dateTime: '2022-04-25T12:00:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-04-25T17:00:00',
            timeZone: 'Europe/Copenhagen'
        }
    };
    testEvents[2] = {
        summary: 'Simon fuck off',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        colorId: '5',
        start: {
            dateTime: '2022-04-25T12:00:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-04-25T17:00:00',
            timeZone: 'Europe/Copenhagen'
        }
    };
    return testEvents;
}

async function validateEventsObj(events) {
    let validateObj = {
        isValid: true,
        comment: ''
    };

    try {
        if (isNumberOfEventsValid(events) == false) throw 'Number of events not accepted';
        for (let event of events) {
            if (events[event] != null) {
                if (isTitleValid(events[event]) == false) throw 'Missing title of event';
                if (isEndDatetimeAfterStartDatetime(events[event]) == false)
                    throw "End date/time of event '" + events[event].summary + "' is before start date/time";
                if (isStartDateTimeInPast(events[event]) == false)
                    throw "Start date/time of event '" + events[event].summary + "' is in the past";
            }
        }
    } catch (err) {
        validateObj.isValid = false;
        validateObj.comment = err;
        return validateObj;
    }

    return validateObj;
}

function isTitleValid(event) {
    if (event.summary === '') {
        return false;
    }
}

function isNumberOfEventsValid(events) {
    if (events.length == 0 || events.length > 3) {
        return false;
    }
}

function isEndDatetimeAfterStartDatetime(event) {
    if (event.start.dateTime >= event.end.dateTime) {
        return false;
    }
}

function isStartDateTimeInPast(event) {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -5);

    if (event.start.dateTime <= localISOTime) {
        return false;
    }
}

async function handleGoogleAuth(googleRespones) {
    let urlResponse = await getAuthorizationURL(); //get authorization url from server.
    if (urlResponse != false) {
        //if redirect url is not returned, the server failed and client cannot be redirected.
        let jsonResponse = await urlResponse.json(); //converts response to json
        window.location.href = jsonResponse.url; //opens the URL that enables user to
    } else {
        window.alert('Error in redirection to authorization procedure!'); //alert user that server failed and redirection did not happen
    }
}

async function saveAndValidateEventsOnServer(events) {
    let response = await postEventsServer(events);
    return new Promise((resolve, reject) => {
        // do some async task
        resolve(response);
    });
}

async function postEventsServer(events) {
    return fetch('http://localhost:3000/saveEventsOnServer', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(events)
    })
        .then((response) => {
            return response.json();
        })
        .then((jsonRes) => {
            console.log(jsonRes);
            return jsonRes;
        });
}

//function that validates idToken with Google
//*NEW* function is no longer in use
async function validateGoogleToken(googleResponse) {
    let response = await fetch('http://localhost:3000/validateIdToken', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: googleResponse.credential
    });
    return response;
}

//function gets authorizationURL from server.
async function getAuthorizationURL() {
    try {
        let redirectURL = await fetch(`http://localhost:3000/authorizationRedirect`, {
            method: 'GET'
        });
        return redirectURL;
    } catch {
        return false;
    }
}

//  COOKIE-HANDLE
//function creates session cookie at client
function createSessionCookie(cookieName, cookieValue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000); //converts days to ms
    let expires = 'expires=' + d.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

//function deletes session cookie at client
function deleteSessionCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
