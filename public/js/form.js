let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];

let eventLocation = document.getElementById('eventlocation');
let eventStartTime = document.getElementById('starttime');
let eventStartDate = document.getElementById('startdate');
let eventEndTime = document.getElementById('endtime');
let eventEndDate = document.getElementById('enddate');

let transportToEventFieldInput = false;
let transportFromEventFieldInput = false;
let eventStartDateInput = false;
let eventStartTimeInput = false;
let eventEndDateInput = false;
let eventEndTimeInput = false;
let eventLocationInput = false;

addToBtn.addEventListener('click', () => {
    addToBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'startlocation', 'id': 'startlocation', 'placeholder': 'Starting point'};
    setAttributes(location, attributes);
    
    addToBtn.appendChild(location);  
    let transportToEventField = document.getElementById('startlocation');

    transportToEventField.addEventListener('input', function () {
        console.log("function called for to transport");
        let toTransportValue = transportToEventField.value;
        console.log("Test Value to transport:"+toTransportValue);
    });
    
}, { once: true });

addFromBtn.addEventListener('click', () => {
    addFromBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'endlocation', 'id': 'endlocation', 'placeholder': 'Destination'};
    setAttributes(location, attributes);
    
    addFromBtn.appendChild(location);  
    let transportFromEventField = document.getElementById(`endlocation`);

    transportFromEventField.addEventListener('input', function () {
        console.log("function called for from transport");
        let fromTransportValue = transportFromEventField.value;
        console.log("Test Value from transport:"+fromTransportValue);
    });

}, { once: true });


function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

eventStartDate.addEventListener('input', function () {
    eventStartDateInput = true;
    toEventAPICall();
    fromEventAPICall();
});

eventStartTime.addEventListener('input', function () {
    eventStartTimeInput = true;
    toEventAPICall();
    fromEventAPICall();
});

eventEndDate.addEventListener('input', function () {
    eventEndDateInput = true;
    toEventAPICall();
    fromEventAPICall();
});

eventEndTime.addEventListener('input', function () {
    eventEndTimeInput = true;
    toEventAPICall();
    fromEventAPICall();
});

eventLocation.addEventListener('input', function () {
    eventLocationInput = true;
    toEventAPICall();
    fromEventAPICall();
});

function toEventAPICall(){
    if (transportToEventFieldInput && eventStartDateInput && eventStartTimeInput && eventLocationInput){

        console.log("All required fields are filled for transport to event api call ----------------");
    
    }
}

function fromEventAPICall(){
    if(transportFromEventFieldInput && eventEndDateInput && eventEndTimeInput && eventLocationInput){

        console.log("All required fields are filled for transport from event api call !!!!!!!!!!!!!");

    }
}