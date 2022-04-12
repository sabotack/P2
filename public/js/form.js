let addTransportButtons = document.querySelectorAll('.transport-button');
let addToBtn = addTransportButtons[0], addFromBtn = addTransportButtons[1];

let startLocationToEvent = document.querySelector('.modal-content input')

let toModal = document.querySelector('#tto-modal');
let fromModal = document.querySelector('#tfrom-modal');
let modalButtons = document.querySelectorAll('.modal-button');

let eventTitle = document.querySelector('#eventtitle').focus();
let eventLocation = document.querySelector('#eventlocation');
let eventLocationList = document.querySelector('#eventlocationlist');
let eventStartTime = document.querySelector('#starttime');
let eventStartDate = document.querySelector('#startdate');
let eventEndTime = document.querySelector('#endtime');
let eventEndDate = document.querySelector('#enddate');

// Cancel button for add transport to event modal
modalButtons[0].addEventListener('click', (e) => {
    e.preventDefault();
    toModal.style.display = 'none';
});

// Cancel button for add transport from event modal
modalButtons[2].addEventListener('click', (e) => {
    e.preventDefault();
    fromModal.style.display = 'none';
});

toModal.addEventListener('click', (event) => {
    if (event.target == toModal){
        toModal.style.display = 'none';
    }
});

fromModal.addEventListener('click', (event) => {
    if (event.target == fromModal){
        fromModal.style.display = 'none';
    }
});

addToBtn.addEventListener('click', () => {
    toModal.style.display = "block";    
});

addFromBtn.addEventListener('click', () => {
    fromModal.style.display = "block";
});

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

function checkRequiredTransportFrom() {
    if(eventEndDate.value != '' && eventEndTime.value != '' && eventLocation.value != '') {
        addFromBtn.classList.remove('disabled');
    }
    else {
        addFromBtn.classList.add('disabled');
    }
}

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

autocomplete(eventLocation);

function autocomplete(input) { 

    input.addEventListener('input', () => {
        checkRequiredTransportTo();
        checkRequiredTransportFrom();

        deleteChild();

        let list = document.createElement("div");
        list.setAttribute("id", input.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        input.parentNode.appendChild(list);

        locationServiceCallAPI(input.value).then((response) => {

            response.forEach(element => {

                let option = document.createElement("div");
                option.innerHTML += (element[':@']['@_name']);
                option.innerHTML += "<input type='hidden' value='" + (element[':@']['@_name']) + "'>";

                list.appendChild(option);
            });

            /*option.addEventListener("click", function() {
                console.log(this.getElementsByTagName("input")[0].value);
            });*/
            
            // option.addEventListener("click", event => {
            //     value = this.document.querySelector("#eventlocation");
            //     value.append(event.target);
            // });
            

        }, function(err) {
            console.log(err);
        });

    });

    

    function closeLists(element) {
        let listItems = document.querySelectorAll(".autocomplete-items");
        for (let i = 0; i < listItems.length; i++) {
            if (element != listItems[i] && element != input) {
                listItems[i].parentNode.removeChild(listItems[i]);
            }
        }
    }

    /* document.addEventListener("click", function (e) {
        closeLists(e.target);
    }); */
}

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


function deleteChild() {
    console.log("Function Called");
    let elements = document.getElementsByClassName('autocomplete-items'),
    element;
    while (element = elements[0]) {
    element.parentNode.removeChild(element);
    }
}