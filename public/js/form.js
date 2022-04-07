let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];

addToBtn.addEventListener('click', () => {
    addToBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'startlocation', 'id': 'startlocation', 'placeholder': 'Starting point'};
    setAttributes(location, attributes);
    
    addToBtn.appendChild(location);  
    console.log("NEW TEXT BOX");
    let transportToEventField = document.getElementById('startlocation');

    transportToEventField.addEventListener('keydown', function (evt) {
        console.log("INPUT ON TRANSPROT TO EVENT FIELD")
    });
    
}, { once: true });

addFromBtn.addEventListener('click', () => {
    addFromBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'endlocation', 'id': 'endlocation', 'placeholder': 'Destination'};
    setAttributes(location, attributes);
    
    addFromBtn.appendChild(location);  
    console.log("NEW TEXT BOX");
    let transportFromEventField = document.getElementById(`endlocation`);

    transportFromEventField.addEventListener('keydown', function (evt) {
        console.log("INPUT ON TRANSPROT FROM EVENT FIELD");
    });
}, { once: true });


function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}