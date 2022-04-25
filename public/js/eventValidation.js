export {validateEventsObj};

async function validateEventsObj(events) {
    let validateObj = {
        isValid: true,
        comment: ''
    };

    try {
        if (isNumberOfEventsValid(events) == false) 
            throw 'Number of events not accepted';
        for (let event in events) {
            if (events[event] != null) {
                if (isTitleValid(events[event]) == false) 
                    throw 'Missing title of event';
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
    console.log("isEndDateTimeAfterStartDateTime");
    if (event.start.dateTime >= event.end.dateTime) {
        return false;
    }
}

function isStartDateTimeInPast(event) {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -5);

    console.log(localISOTime + "vs" + event.start.dateTime);
    if (event.start.dateTime <= localISOTime) {
        return false;
    }
}