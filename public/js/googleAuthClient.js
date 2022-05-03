import { validateEventsObj } from './eventValidation.js';
export { submitForm, saveAndValidateEventsOnServer, postEventsServer, getAuthorizationURL };

//function that handles submission of form. Recieves array of event(s) as imput
async function submitForm(events) {
    let eventsIsAccepted = await validateEventsObj(events); //client-side validation of events.
    if (eventsIsAccepted.isValid == false) {
        //if events is not valid
        window.alert(eventsIsAccepted.comment);
    } else {
        //if events is valid.
        saveAndValidateEventsOnServer(events).then((eventsIsValid) => {
            //post events to server where they are stored temporarily
            if (eventsIsValid.body == false) {
                //server responds with wether events is valid or not.
                window.alert('Server did not accept submitted event');
            } else {
                //if server validated events, then sign in with google and post events to calendar.
                handleGoogleAuth();
            }
        });
    }
}

//function that redirects user to google authorization
async function handleGoogleAuth() {
    let urlResponse = await getAuthorizationURL(); //get authorization url from server.
    if (urlResponse != false) {
        //if redirect url is not returned, the server failed and client cannot be redirected.
        let jsonResponse = await urlResponse.json(); //converts response to json
        window.location.href = jsonResponse.url; //opens the URL that prompts login and authorization
    } else {
        //if error on server, client gets error message.
        window.alert('Error in redirection to authorization procedure!'); //alert user that server failed and redirection did not happen
    }
}

//function that posts events to server
async function saveAndValidateEventsOnServer(events) {
    let response = await postEventsServer(events); //post events to server
    return new Promise((resolve, reject) => {
        //returns promise to enable ".then" in order to wait for validation respones from server.
        resolve(response); //resolves response when it is recieved from server.
    });
}

//function does a fetch POST to server with events.
async function postEventsServer(events) {
    return fetch('http://localhost:3000/saveEventsOnServer', {
        //returns promise, and then proceeds to fetch server.
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(events) //body contains stringified events in order to send accross network
    })
        .then((response) => {
            //when response is recieved, convert it to json.
            return response.json();
        })
        .then((jsonRes) => {
            //when json response is recieved, return it
            return jsonRes;
        });
}

//function gets authorizationURL from server.
async function getAuthorizationURL() {
    try {
        let redirectURL = await fetch(`http://localhost:3000/authorizationRedirect`, {
            //get url from server endpoint
            method: 'GET'
        });
        return redirectURL;
    } catch {
        //on server error, return false in order to notify client.
        return false;
    }
}
