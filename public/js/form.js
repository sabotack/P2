import { autocomplete } from './autocomplete.js';
import { selectedTripObject, setSelectedTrip, selectedTrip } from './tripSelection.js';
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

let formSubmit = document.querySelector('#formsubmit');

let events = [];

eventTitle.focus();
autocomplete(eventLocation);
autocomplete(preEventLocation);
autocomplete(postEventLocation);

formSubmit.addEventListener('click', () => {
    let title = eventTitle.value;
    let location = getFirstStopName(selectedTripObject);
    let description = '';
    let dateTimeStart = eventStartDate.value + 'T' + selectedTripObject['0']['Leg']['0'][':@']['@_time'];
    let dateTimeEnd = eventEndDate.value + 'T' + eventEndTime.value;
    events[1] = new Event(title, location, description, dateTimeStart, dateTimeEnd);
});

// Cancel button for add transport to event modal
modalButtons[0].addEventListener('click', () => {
    preEventModal.style.display = 'none';
    setSelectedTrip('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[1].classList.add('disabled');
});

// Add button for add transport to event modal
modalButtons[1].addEventListener('click', () => {
    preEventModal.style.display = 'none';
    addSelectedTrip(preEventLocation, addToBtn, selectedTripObject);
    
    events[0] = new Event('Pre-event transport', getFirstStopName(selectedTripObject), '', eventStartDate.value + 'T' + eventStartTime.value, eventEndDate.value + 'T' + eventEndTime.value);
    
    setSelectedTrip('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[1].classList.add('disabled');

});

// Cancel button for add transport from event modal
modalButtons[2].addEventListener('click', () => {
    postEventModal.style.display = 'none';
    setSelectedTrip('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[3].classList.add('disabled');
});

// Add button for add transport from event modal
modalButtons[3].addEventListener('click', () => {
    postEventModal.style.display = 'none';
    addSelectedTrip(postEventLocation, addFromBtn, selectedTripObject);
    setSelectedTrip('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[3].classList.add('disabled');

    events[2] = new Event('Pre-event transport', preEventLocation.value, '', eventStartDate.value + 'T' + eventStartTime.value, eventEndDate.value + 'T' + eventEndTime.value);
});

preEventModal.addEventListener('click', (event) => {
    if (event.target == preEventModal) {
        preEventModal.style.display = 'none';
        setSelectedTrip('');
        modalButtons[1].classList.add('disabled');
        selectedTrip.classList.remove('trip-selected');
    }
});

postEventModal.addEventListener('click', (event) => {
    if (event.target == postEventModal) {
        postEventModal.style.display = 'none';
        setSelectedTrip('');
        modalButtons[3].classList.add('disabled');
        selectedTrip.classList.remove('trip-selected');
    }
});

addToBtn.addEventListener('click', () => {
    preEventModal.style.display = 'block';
});

addFromBtn.addEventListener('click', () => {
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
    for(const element of trip) {
        if (element[':@']['@_type'] !== 'WALK') {
            return element['Leg'][0][':@']['@_name'];
        }
    }
}

function addSelectedTrip(locationInput, button, selectedTripObject) {
    button.textContent = '';
    
    let eventLocationSelected = document.createElement('div');
    eventLocationSelected.classList.add('event-selected');
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

    button.appendChild(eventLocationSelected);
    eventLocationSelected.appendChild(transportTitle);
    eventLocationSelected.appendChild(eventLocation);
    eventLocationSelected.appendChild(eventTime);
}

function Event(title, location, description, dateTimeStart, dateTimeEnd) {
    this.summary = title;
    this.location = location;
    this.colorId = 6;
    this.description = description;
    this.start = {
        datetime: dateTimeStart,
        timeZone: 'Europe/Copenhagen'
    };
    this.end = {
        datetime: dateTimeEnd,
        timeZone: 'Europe/Copenhagen'
    }
}
