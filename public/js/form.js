let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];

let eventLocation = document.getElementById('eventlocation');
let eventTime = document.getElementById('starttime');
let eventDate = document.getElementById('startdate');

let transportToEventFieldInput = false;
let transportFromEventFieldInput = false;
let eventDateInput = false;
let eventTimeInput = false;
let eventLocationInput = false;

addToBtn.addEventListener('click', () => {
    addToBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'startlocation', 'id': 'startlocation', 'placeholder': 'Starting point'};
    setAttributes(location, attributes);
    
    addToBtn.appendChild(location);  
    let transportToEventField = document.getElementById('startlocation');

    transportToEventField.addEventListener('input', function (evt) {
        transportToEventFieldInput = true;
    }, { once: true });
    
}, { once: true });

addFromBtn.addEventListener('click', () => {
    addFromBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'endlocation', 'id': 'endlocation', 'placeholder': 'Destination'};
    setAttributes(location, attributes);
    
    addFromBtn.appendChild(location);  
    let transportFromEventField = document.getElementById(`endlocation`);

    transportFromEventField.addEventListener('input', function (evt) {
        transportFromEventFieldInput = true;
    }, { once: true });
}, { once: true });


function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

eventDate.addEventListener('input', function (evt) {
    eventDateInput = true;
    checkIfFieldsAreFilled();
}, { once: true });

eventTime.addEventListener('input', function (evt) {
    eventTimeInput = true;
    checkIfFieldsAreFilled();
}, { once: true });

eventLocation.addEventListener('input', function (evt) {
    eventLocationInput = true;
    checkIfFieldsAreFilled();
}, { once: true });

function checkIfFieldsAreFilled(){
    if (transportToEventFieldInput && eventDateInput && eventTimeInput && eventLocationInput){

        console.log("All required fields are filled for transportToEventAPIcall");
    
    }
}