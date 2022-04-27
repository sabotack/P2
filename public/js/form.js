import { submitForm } from './googleAuthClient.js';
import { autocomplete } from './autocomplete.js';
import { selectedTripObject, setSelectedTripObject, selectedTrip } from './tripSelection.js';
import { checkRequiredTransportTo, checkRequiredTransportFrom } from './checks.js';

export { eventStartDate, eventStartTime, eventEndDate, eventEndTime, addToBtn, addFromBtn, eventLocation };

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

    console.log(events);

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
    let description = transportDescriptionCreator(selectedTripObject); // here asshole
    let dateTimeStart = eventStartDate.value + 'T' + selectedTripObject['0']['Leg']['0'][':@']['@_time'] + ':00';
    let dateTimeEnd =
        eventStartDate.value +
        'T' +
        selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'] +
        ':00';
    events[0] = new Event(title, location, description, dateTimeStart, dateTimeEnd, 6);

    preEventModal.style.display = 'none';
    addSelectedTrip(preEventLocation, addToBtn, selectedTripObject);
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
    let description = transportDescriptionCreator(selectedTripObject); // here asshole
    let dateTimeStart = eventEndDate.value + 'T' + selectedTripObject['0']['Leg']['0'][':@']['@_time'] + ':00';
    let dateTimeEnd =
        eventEndDate.value +
        'T' +
        selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'] +
        ':00';
    events[2] = new Event(title, location, description, dateTimeStart, dateTimeEnd, 6);

    postEventModal.style.display = 'none';
    addSelectedTrip(postEventLocation, addFromBtn, selectedTripObject);
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

eventStartTime.addEventListener('input', () => {
    checkRequiredTransportTo();
});

eventEndDate.addEventListener('input', () => {
    checkRequiredTransportFrom();
});

eventEndTime.addEventListener('input', () => {
    checkRequiredTransportFrom();
});

function getFirstStopName(trip) {
    for (const element of trip) {
        if (element[':@']['@_type'] !== 'WALK') {
            return element['Leg'][0][':@']['@_name'];
        }
    }
}

function addSelectedTrip(locationInput, button, selectedTripObject) {
    button.textContent = '';

    /* let eventLocationSelected = document.createElement('div');
    eventLocationSelected.classList.add('event-selected'); */
    button.classList.add('event-selected');

    let transportRemove = document.createElement('div');
    transportRemove.classList.add('transport-remove');

    let removeIcon = document.createElement('i');
    removeIcon.classList.add('fa-solid', 'fa-xmark', 'fa-xl');

    transportRemove.addEventListener('click', () => {
        button.innerHTML = '';
        button.classList.remove('event-selected');
        button.parentElement.children[1].remove();

        let p = document.createElement('p');
        if (button === addTransportButtons[0]) {
            p.textContent = '+ add transport to event';
            events.splice(0);
        } else {
            p.textContent = '+ add transport from event';
            events.splice(2);
        }
        button.appendChild(p);
    });

    let transportTitle = document.createElement('p');
    transportTitle.classList.add('transport-title');
    transportTitle.textContent = button === addTransportButtons[0] ? 'Pre-event transport' : 'Post-event transport';
    let eventLocation = document.createElement('p');
    eventLocation.textContent = locationInput.value;
    eventLocation.classList.add('event-location');
    let eventTime = document.createElement('p');
    eventTime.classList.add('event-time');
    eventTime.textContent =
        selectedTripObject['0']['Leg']['0'][':@']['@_time'] +
        ' - ' +
        selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'];

    button.appendChild(transportTitle);
    button.appendChild(eventLocation);
    button.appendChild(eventTime);
    button.after(transportRemove);
    transportRemove.appendChild(removeIcon);
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

function transportDescriptionCreator(trip) {
    let description = '';

    for (let i = 0; i < trip.length; i++) {
        description +=
            'Travel time: <b>' +
            trip[i]['Leg'][0][':@']['@_time'] +
            ' </b>' +
            '→' +
            '<b> ' +
            trip[i]['Leg'][1][':@']['@_time'] +
            '</b><br>';
        description += 'Origin: <b>' + trip[i]['Leg'][0][':@']['@_name'] + '</b><br>';

        if (trip[i][':@']['@_type'] == 'WALK') {
            description += 'Transportation type: <b>' + trip[i][':@']['@_type'] + '</b><br>';
        } else {
            description += 'Transportation name: <b>' + trip[i][':@']['@_name'] + '</b><br>';
        }

        description += 'Destination: <b>' + trip[i]['Leg'][1][':@']['@_name'] + '</b><br>';

        if (i !== trip.length - 1) {
            description += '<br>';
        }
    }

    return description;
}
