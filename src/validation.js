export {validateEventsObj};

//validates events on the server-side
async function validateEventsObj(events) {
    let validateResult = true;
    try {
        if (isNumberOfEventsValid(events) == false) 
            throw 'Number of events not accepted';
        for (let event in events) {
            if (events[event] != null) {
                if (isTitleValid(events[event]) == false) 
                    throw 'title not valid';
                if (isEndDatetimeAfterStartDatetime(events[event]) == false)
                    throw "end before start";
                if (isStartDateTimeInPast(events[event]) == false)
                    throw "start in past";
            }
        }
    } catch (err) {
        validateResult = false;
        console.log(err);
        return validateResult;
    }

    return validateResult;
}

//Function that checks if the Title of the event is valid on the server site.
function isTitleValid(event) {
    if (event.summary === '') {//Checks whether there input box is empty, if it is. Then it returns false and an error.
        return false;
    }
}

//function that checks if the number of events are correct to avoid potential postman attack
function isNumberOfEventsValid(events) {
    if (events.length == 0 || events.length > 3) {
        console.log(events.length);
        return false;
    }
}

//function that ensures the end-time is not before the start-time
function isEndDatetimeAfterStartDatetime(event) {
    if (event.start.dateTime >= event.end.dateTime) {
        return false;
    }
}

//Function that checks if the events starting time has already happened.
function isStartDateTimeInPast(event) {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -5);//Ignores milliseconds from the string, as it is irrelevant.

    if (event.start.dateTime <= localISOTime) {//If the start time of the event is before the actual time, then the function will return false, and an error.
        return false;
    }
}