import { selectedTripObject, setSelectedTripObject, selectedTrip } from './tripSelection.js';
import { checkRequiredTransportTo, checkRequiredTransportFrom } from './checks.js';
import { autocomplete, setEventLocationPicked } from './autocomplete.js';
import { transportDescriptionCreator } from './tripDescription.js';
import { addSelectedTrip } from './addSelectedTrip.js';
import { convertToDate } from './dateConverter.js';
import { submitForm } from './googleAuthClient.js';

export { eventStartDate, eventStartTime, eventEndDate, eventEndTime, addToBtn, addFromBtn, eventLocation, events };

let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0],
    addFromBtn = addTransportButtons[1];

let preEventModal = document.querySelector('#pre-event-modal');
let postEventModal = document.querySelector('#post-event-modal');
let modalButtons = document.querySelectorAll('.modal-button');

let preEventLocation = document.querySelector('#pre-event-location');
let eventLocation = document.querySelector('#eventlocation');
let postEventLocation = document.querySelector('#post-event-location');

let eventTitle = document.querySelector('#eventtitle');
let eventStartTime = document.querySelector('#starttime');
let eventStartDate = document.querySelector('#startdate');
let eventEndTime = document.querySelector('#endtime');
let eventEndDate = document.querySelector('#enddate');
let eventDescription = document.querySelector('#eventdescription');

let formSubmit = document.querySelector('#formsubmit');

let events = [];

setMaxDate(2); // Input parameter is how many months ahead you can select trips
eventStartDate.valueAsDate = new Date();
setMinDate();

eventTitle.focus();
autocomplete(eventLocation);
autocomplete(preEventLocation);
autocomplete(postEventLocation);

formSubmit.addEventListener('click', (event) => {
    if (!document.querySelector('form').checkValidity()) {
        return false;
    }

    event.preventDefault();
    let title = eventTitle.value;
    let location = eventLocation.value;
    let description = eventDescription.value;
    let dateTimeStart = eventStartDate.value + 'T' + eventStartTime.value + ':00';
    let dateTimeEnd = eventEndDate.value + 'T' + eventEndTime.value + ':00';
    events[1] = new Event(title, location, description, dateTimeStart, dateTimeEnd, 9);

    submitForm(events);
});

// Cancel button for add transport to event modal
modalButtons[0].addEventListener('click', () => {
    preEventModal.style.display = 'none';
    setSelectedTripObject('');
    if (selectedTrip) {
        selectedTrip.classList.remove('trip-selected');
        modalButtons[1].classList.add('disabled');
    }
});

// Add button for add transport to event modal
modalButtons[1].addEventListener('click', () => {
    let title = 'Pre-event transport';
    let location = getFirstStopName(selectedTripObject);
    let description = transportDescriptionCreator(selectedTripObject);
    let dateStart = convertToDate(selectedTripObject['0']['Leg']['0'][':@']['@_date']);
    let dateEnd = convertToDate(selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_date']);
    let timeStart = selectedTripObject['0']['Leg']['0'][':@']['@_time'] + ':00';
    let timeEnd = selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'] + ':00';

    let dateTimeStart = dateStart + 'T' + timeStart;
    let dateTimeEnd = dateEnd + 'T' + timeEnd;
    events[0] = new Event(title, location, description, dateTimeStart, dateTimeEnd, 6);

    preEventModal.style.display = 'none';
    addSelectedTrip(addToBtn, selectedTripObject);
    setSelectedTripObject('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[1].classList.add('disabled');
});

// Cancel button for add transport from event modal
modalButtons[2].addEventListener('click', () => {
    postEventModal.style.display = 'none';
    setSelectedTripObject('');
    if (selectedTrip) {
        selectedTrip.classList.remove('trip-selected');
        modalButtons[3].classList.add('disabled');
    }
});

// Add button for add transport from event modal
modalButtons[3].addEventListener('click', () => {
    let title = 'Post-event transport';
    let location = getFirstStopName(selectedTripObject);
    let description = transportDescriptionCreator(selectedTripObject);
    let dateStart = convertToDate(selectedTripObject['0']['Leg']['0'][':@']['@_date']);
    let dateEnd = convertToDate(selectedTripObject[selectedTripObject.length - 1]['Leg']['0'][':@']['@_date']);
    let timeStart = selectedTripObject['0']['Leg']['0'][':@']['@_time'] + ':00';
    let timeEnd = selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'] + ':00';

    let dateTimeStart = dateStart + 'T' + timeStart;
    let dateTimeEnd = dateEnd + 'T' + timeEnd;
    events[2] = new Event(title, location, description, dateTimeStart, dateTimeEnd, 6);

    postEventModal.style.display = 'none';
    addSelectedTrip(addFromBtn, selectedTripObject);
    setSelectedTripObject('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[3].classList.add('disabled');
});

preEventModal.addEventListener('click', (event) => {
    if (event.target == preEventModal) {
        preEventModal.style.display = 'none';
        setSelectedTripObject('');
        modalButtons[1].classList.add('disabled');
        selectedTrip.classList.remove('trip-selected');
    }
});

postEventModal.addEventListener('click', (event) => {
    if (event.target == postEventModal) {
        postEventModal.style.display = 'none';
        setSelectedTripObject('');
        modalButtons[3].classList.add('disabled');
        selectedTrip.classList.remove('trip-selected');
    }
});

addToBtn.addEventListener('click', (event) => {
    preEventModal.style.display = 'block';
});

addFromBtn.addEventListener('click', (event) => {
    postEventModal.style.display = 'block';
});

eventStartDate.addEventListener('input', () => {
    checkRequiredTransportTo();
});

eventStartDate.addEventListener('focusout', () => {
    eventEndDate.valueAsDate = eventStartDate.valueAsDate;
});

eventStartTime.addEventListener('input', () => {
    checkRequiredTransportTo();
});

eventEndDate.addEventListener('input', () => {
    checkRequiredTransportFrom();
});

eventEndTime.addEventListener('input', () => {
    checkRequiredTransportFrom();
});

eventLocation.addEventListener('input', () => {
    setEventLocationPicked(false);
    checkRequiredTransportFrom();
    checkRequiredTransportTo();
});

function getFirstStopName(trip) {
    for (const element of trip) {
        if (element[':@']['@_type'] !== 'WALK') {
            return element['Leg'][0][':@']['@_name'];
        }
    }
}

function setMaxDate(monthsAhead) {
    let today = new Date();

    let monthsAheadDate = addMonths(today, monthsAhead).toISOString().split('T')[0];
    eventStartDate.max = monthsAheadDate;
    eventEndDate.max = monthsAheadDate;
}

function addMonths(date, months) {
    let d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}

function setMinDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;

    eventStartDate.setAttribute('min', today);
    eventEndDate.setAttribute('min', today);
}

function Event(title, location, description, dateTimeStart, dateTimeEnd, color) {
    this.summary = title;
    this.location = location;
    this.colorId = color;
    this.description = description;
    this.start = {
        dateTime: dateTimeStart,
        timeZone: 'Europe/Copenhagen'
    };
    this.end = {
        dateTime: dateTimeEnd,
        timeZone: 'Europe/Copenhagen'
    };
}

window.onload = function () {
    let queryStr = window.location.search;
    let parsedData = new URLSearchParams(queryStr);
    let val = parsedData.get('EventsPosted');
    if (val != null)
        alert(val === 'Error' ? 'Events were not posted to calendar!' : 'Events were posted to your Google Calendar');
};
