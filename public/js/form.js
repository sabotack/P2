import { convertToDate } from './dateConverter.js';
import { submitForm } from './googleAuthClient.js';
import { autocomplete } from './autocomplete.js';
import { transportDescriptionCreator } from './tripDescription.js';
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

setMaxDate(2); // Input parameter is how many months ahead you can select trips

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
    let description = transportDescriptionCreator(selectedTripObject);
    let dateStart = convertToDate(selectedTripObject['0']['Leg']['0'][':@']['@_date']);
    let dateEnd = convertToDate(selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_date']);
    let timeStart = selectedTripObject['0']['Leg']['0'][':@']['@_time'] + ':00';
    let timeEnd = selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'] + ':00';

    let dateTimeStart = dateStart + 'T' + timeStart;
    let dateTimeEnd = dateEnd + 'T' + timeEnd;
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
    let description = transportDescriptionCreator(selectedTripObject);
    let dateStart = convertToDate(selectedTripObject['0']['Leg']['0'][':@']['@_date']);
    let dateEnd = convertToDate(selectedTripObject[selectedTripObject.length - 1]['Leg']['0'][':@']['@_date']);
    let timeStart = selectedTripObject['0']['Leg']['0'][':@']['@_time'] + ':00';
    let timeEnd = selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'] + ':00';

    let dateTimeStart = dateStart + 'T' + timeStart;
    let dateTimeEnd = dateEnd + 'T' + timeEnd;
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

    if(button.parentElement.children[1]) {
        button.parentElement.children[1].remove();
    }
    
    button.classList.add('event-selected');

    let transportRemove = document.createElement('div');
    transportRemove.classList.add('transport-remove');

    let removeIcon = document.createElement('i');
    removeIcon.classList.add('fa-solid', 'fa-xmark', 'fa-xl');

    let transportTitle = document.createElement('p');
    transportTitle.classList.add('transport-title');
    transportTitle.textContent = button === addTransportButtons[0] ? 'Pre-event transport' : 'Post-event transport';
    let eventLocationText = document.createElement('p');
    eventLocationText.classList.add('event-location');
    let eventTime = document.createElement('p');
    eventTime.classList.add('event-time');
    eventTime.textContent =
        selectedTripObject['0']['Leg']['0'][':@']['@_time'] +
        ' - ' +
        selectedTripObject[selectedTripObject.length - 1]['Leg']['1'][':@']['@_time'];

    button.appendChild(transportTitle);
    button.appendChild(eventLocationText);
    button.appendChild(eventTime);
    button.after(transportRemove);
    transportRemove.appendChild(removeIcon);

    eventLocation.addEventListener('input', () => {
        if(button.parentElement.children[1]){
            removeTransport(button);  
        }
    }, {once: true});

    transportRemove.addEventListener('click', () => {
        removeTransport(button);
    });
    
    // Button specific functions
    if (button === addTransportButtons[0]) {
        eventLocationText.textContent = selectedTripObject[0]['Leg'][0][':@']['@_name'];

        eventStartDate.addEventListener('input', () => {
            if (button.parentElement.children[1]){
                removeTransport(button);
            }
        }, { once: true });
    
        eventStartTime.addEventListener('input', () => {
            if (button.parentElement.children[1]){
                removeTransport(button);
            }            
        }, { once: true });

    } else {
        let lastTrip = selectedTripObject.length-1;
        eventLocationText.textContent = selectedTripObject[lastTrip]['Leg'][0][':@']['@_name'];

        eventEndDate.addEventListener('input', () => {
            if (button.parentElement.children[1]){
                removeTransport(button);
            }
        }, { once: true });
    
        eventEndTime.addEventListener('input', () => {
            if (button.parentElement.children[1]){
                removeTransport(button);
            }
        }, { once: true });
    }
}

function removeTransport(button){
    button.innerHTML = '';
    button.classList.remove('event-selected');
    button.parentElement.children[1].remove();

    let p = document.createElement('p');
    if (button === addTransportButtons[0]) {
        p.textContent = '+ add pre-event transport';
        events.splice(0);
    } else {
        p.textContent = '+ add post-event transport';
        events.splice(2);
    }
    button.appendChild(p);
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

function setMaxDate(monthsAhead){

    let today = new Date();

    let test123 = addMonths(today, monthsAhead).toISOString().split("T")[0];
    eventStartDate.max = test123;
    eventEndDate.max = test123;

}

function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}