//  GOOGLE FUNCTIONS
//callback function that is used when sign-in button is clicked.
async function googleCallback(googleResponse) {
    const testEvents = [{
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
        'dateTime': '2022-04-15T09:00:00-07:00',
        'timeZone': 'Europe/Copenhagen'
        },
        'end': {
        'dateTime': '2022-04-15T17:00:00-07:00',
        'timeZone': 'Europe/Copenhagen'
        },
        },
        {
        'summary': 'Anders mongol',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
        'dateTime': '2022-04-16T09:00:00-07:00',
        'timeZone': 'Europe/Copenhagen'
        },
        'end': {
        'dateTime': '2022-04-16T17:00:00-07:00',
        'timeZone': 'Europe/Copenhagen'
        },
        }];
    await postEventsToCalendar(testEvents);
    await handleGoogleAuth(googleResponse);
}


async function handleGoogleAuth(googleRespones) {
    // let validateResponse = await validateGoogleToken(googleResponse); //validates that signin happened, and that id_token is accepted
    // createSessionCookie('google-session-token', googleResponse.credential, 7); //Creates a cookie that is active for 7 days
    let urlResponse = await getAuthorizationURL(); //get authorization url from server.
    if(urlResponse != false) { //if redirect url is not returned, the server failed and client cannot be redirected.
        let jsonResponse = await urlResponse.json(); //converts response to json
        window.location.href = jsonResponse.url; //opens the URL that enables user to
    } else {
        window.alert("Error in redirection to authorization procedure!"); //alert user that server failed and redirection did not happen
    }
}

async function postEventsToCalendar(events) {
    console.log(JSON.stringify(events));
    let response = await fetch('http://localhost:3000/GoogleCalendarPost', {
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
    try{
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

