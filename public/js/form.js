import { autocomplete } from './autocomplete.js';
import { tripSelected, setSelectedTrip, selectedTrip } from './tripSelection.js';
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

eventTitle.focus();
autocomplete(eventLocation);
autocomplete(preEventLocation);
autocomplete(postEventLocation);

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
    addSelectedTrip(preEventLocation, addToBtn, tripSelected);
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
    addSelectedTrip(postEventLocation, addFromBtn, tripSelected);
    setSelectedTrip('');
    selectedTrip.classList.remove('trip-selected');
    modalButtons[3].classList.add('disabled');
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

function addSelectedTrip(locationInput, button, tripSelected) {
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
        tripSelected['0']['Leg']['0'][':@']['@_time'] +
        ' - ' +
        tripSelected[tripSelected.length - 1]['Leg']['1'][':@']['@_time'];

    button.appendChild(eventLocationSelected);
    eventLocationSelected.appendChild(transportTitle);
    eventLocationSelected.appendChild(eventLocation);
    eventLocationSelected.appendChild(eventTime);
}
