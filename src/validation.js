export {validateEventsObj};

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

function isTitleValid(event) {
    if (event.summary === '') {
        return false;
    }
}

function isNumberOfEventsValid(events) {
    if (events.length == 0 || events.length > 3) {
        console.log(events.length);
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