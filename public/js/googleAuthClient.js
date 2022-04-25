async function submitForm(events) {
    let eventsIsAccepted = await validateEventsObj(events);
    if (!eventsIsAccepted) {
        window.alert('Events submitted is not accepted');
    } else {
        await saveEventsOnServer(events);
        await handleGoogleAuth(googleResponse);
    }
}

async function createEventsObj() {
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
            summary: 'Simon fuck off',
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
    return testEvents;
}

async function validateEventsObj(events) {
    return true;
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

async function saveEventsOnServer(events) {
    let response = await fetch('http://localhost:3000/saveEventsOnServer', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(events)
    });
    return response;
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
