let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];

let startLocationToEvent = document.querySelector('.modal-content input')

let tToModal = document.querySelector('#tto-modal');
let tFromModal = document.querySelector('#tfrom-modal');
let modalButtons = document.querySelectorAll('.modal-button');

let eventTitle = document.querySelector('#eventtitle').focus();
let eventLocation = document.querySelector('#eventlocation');
let eventLocationList = document.querySelector('#eventlocationlist');
let eventStartTime = document.querySelector('#starttime');
let eventStartDate = document.querySelector('#startdate');
let eventEndTime = document.querySelector('#endtime');
let eventEndDate = document.querySelector('#enddate');

modalButtons[0].addEventListener('click', (e) => {
    e.preventDefault();
    tToModal.style.display = 'none';
});

tToModal.addEventListener('click', (event) => {
    if (event.target == tToModal){
        tToModal.style.display = 'none';
    }
});

addToBtn.addEventListener('click', () => {
    tToModal.style.display = "block";
    /* addToBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'startlocation', 'id': 'startlocation', 'placeholder': 'Starting point'};
    setAttributes(location, attributes);
    
    addToBtn.appendChild(location);  
    let transportToEventField = document.querySelector('#startlocation');

    transportToEventField.addEventListener('input', function () {
        console.log("function called for to transport");
        let toTransportValue = transportToEventField.value;
        console.log("Test Value to transport:"+toTransportValue);
        locationServiceCallAPI(toTransportValue);
    }); */
    
}/* , { once: true } */);

modalButtons[2].addEventListener('click', (e) => {
    e.preventDefault();
    tFromModal.style.display = 'none';
});

tFromModal.addEventListener('click', (event) => {
    if (event.target == tFromModal){
        tFromModal.style.display = 'none';
    }
});

addFromBtn.addEventListener('click', () => {
    /* tFromModal.style.display = "block"; */

    addFromBtn.innerHTML = "";
    let location = document.createElement('input');
    let attributes = {'type': 'text', 'name': 'endlocation', 'id': 'endlocation', 'placeholder': 'Destination'};
    setAttributes(location, attributes);
    
    addFromBtn.appendChild(location);  
    let transportFromEventField = document.querySelector('#endlocation');

    transportFromEventField.addEventListener('input', function () {
        let fromTransportValue = transportFromEventField.value;
        let location = locationServiceCallAPI(fromTransportValue);
    });

}, { once: true });


function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function checkRequiredTransportTo() {
    if(eventStartDate.value != '' && eventStartTime.value != '' && eventLocation.value != '') {
        addToBtn.classList.remove('disabled');
    }
    else {
        addToBtn.classList.add('disabled');
    }
}

eventStartDate.addEventListener('input', () => {
    checkRequiredTransportTo();
});

eventStartTime.addEventListener('input', () => {
    checkRequiredTransportTo();
});

eventLocation.addEventListener('input', () => {
    checkRequiredTransportTo();
    
    
    locationServiceCallAPI(eventLocation.value).then(function(response) {
        console.log(response);
        /*Object.keys(response.LocationList.CoordLocation).length;
        console.log("test: "+response.LocationList.CoordLocation.length);
        let test4 = (response.CoordLocation);
        console.log("Certain JSON: "+response.CoordLocation);
        

        test4.forEach(element => {
            let option = document.createElement('option');
            option.value = element;
            eventLocationList.appendChild(eventLocation);
        }) */
    

    }, function(err) {
        console.log(err);
       });

})

function locationServiceCallAPI(inputField){
    return new Promise(function(resolve, reject){

        let xhr = new XMLHttpRequest();

        xhr.open("POST", '/locationService', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send("location="+inputField);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4){
                
                let result = JSON.parse(xhr.responseText); 
                this.status == 200 ? resolve(result) : reject('Error');
            }
        }
    });
}