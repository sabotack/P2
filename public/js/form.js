let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];


addToBtn.addEventListener('click', () => {
    addToBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'startlocation', 'id': 'startlocation', 'placeholder': 'Start location'};
    setAttributes(location, attributes);
    
    addToBtn.appendChild(location);  
});

addFromBtn.addEventListener('click', () => {
    addFromBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'endlocation', 'id': 'endlocation', 'placeholder': 'End location'};
    setAttributes(location, attributes);
    
    addFromBtn.appendChild(location);  
});


function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}