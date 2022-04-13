import {autocomplete} from "./autocomplete.js";
import {checkRequiredTransportTo, checkRequiredTransportFrom} from "./checks.js";

export {eventStartDate, eventStartTime, eventEndDate, eventEndTime, addToBtn, addFromBtn, eventLocation};

let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];

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
modalButtons[0].addEventListener('click', (event) => {
    event.preventDefault();
    preEventModal.style.display = 'none';
});

// Cancel button for add transport from event modal
modalButtons[2].addEventListener('click', (event) => {
    event.preventDefault();
    postEventModal.style.display = 'none';
});

preEventModal.addEventListener('click', (event) => {
    if (event.target == preEventModal){
        preEventModal.style.display = 'none';
    }
});

postEventModal.addEventListener('click', (event) => {
    if (event.target == postEventModal){
        postEventModal.style.display = 'none';
    }
});

addToBtn.addEventListener('click', () => {
    preEventModal.style.display = "block";    
});

addFromBtn.addEventListener('click', () => {
    postEventModal.style.display = "block";
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







