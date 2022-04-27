export { validateEventsObj };

//function that validates inputs on the client-side and returns the error message
async function validateEventsObj(events) {
    let validateObj = {
        isValid: true,
        comment: ''
    };

    try {
        if (isNumberOfEventsValid(events) == false) throw 'Number of events not accepted';
        //each event is checked for missing title, end-time and start-time mismatch and start-date in the past
        for (let event in events) {
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
//Function that checks whether the Title/Summary of the event is valid.
function isTitleValid(event) {
    if (event.summary === '') {
        //Checks if the input box have been filled, if not it returns an error.
        return false;
    }
}

//function that checks number of events
function isNumberOfEventsValid(events) {
    if (events.length == 0 || events.length > 3) {
        return false;
    }
}

//function that ensures the end-time does not come before the start-time
function isEndDatetimeAfterStartDatetime(event) {
    if (event.start.dateTime >= event.end.dateTime) {
        return false;
    }
}
//Function that checks if the start time of the event has already happened.
function isStartDateTimeInPast(event) {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -5); //Ignores milliseconds.

    if (event.start.dateTime <= localISOTime) {
        //If the start time of the event is less than the actual time, then the function returns an error.
        return false;
    }
}
