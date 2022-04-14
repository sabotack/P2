import { tripServiceCallAPI } from "./rejseplanen.js";

export {createTripSelection, createNewTrip};

const tripBox = document.querySelector('.trip-box');

function createTripSelection(tripData) {
    tripServiceCallAPI(tripData).then((response) => {
        response.forEach(element => {
            console.log(element.Trip);
            createNewTrip(element.Trip);
        });
    });
}

function createNewTrip(tripElement) {

    //Create html elements for the trip box
    let trip = document.createElement('div');
    trip.setAttribute('class', 'trip');

    let tripTop = document.createElement('div');
    tripTop.setAttribute('class', 'trip-top');

    let tripStart = document.createElement('div');
    tripStart.setAttribute('class', 'trip-start');
    let tripStartTime = document.createElement('span');

    let tripBar = document.createElement('div');
    tripBar.setAttribute('class', 'trip-bar'); 

    let bar = document.createElement('div');
    bar.setAttribute('class', 'bar');
    
    let tripEnd = document.createElement('div');
    tripEnd.setAttribute('class', 'trip-end');
    let tripEndTime = document.createElement('span');

    let tripInfo = document.createElement('div');
    tripInfo.setAttribute('class', 'trip-info');
    let tripSpecifiedInfo = document.createElement('span');


    let tripAction = document.createElement('trip-action');
    tripAction.setAttribute('class', 'trip-action');

    let detailsButton = document.createElement('div');
    detailsButton.setAttribute('class', 'details-button');
    detailsButton.append('Details');

    //Insert the right elements under the right parent-nodes
    tripBox.appendChild(trip);
    trip.appendChild(tripTop);
    tripTop.appendChild(tripStart);
    tripStart.appendChild(tripStartTime);
    tripTop.appendChild(tripBar);
    tripBar.appendChild(bar);

    getIconElements(tripElement).forEach(element => {
        tripBar.appendChild(element);
    });

    tripTop.appendChild(tripEnd);
    tripEnd.appendChild(tripEndTime);
    trip.appendChild(tripInfo);
    tripInfo.appendChild(tripSpecifiedInfo);
    trip.appendChild(tripAction);
    tripAction.appendChild(detailsButton);
   
    let tripElementLength = tripElement.length-1;
    let tripStartTime1 = tripElement['0']['Leg']['0'][':@']['@_time'];
    let tripEndTime1 = tripElement[tripElementLength]['Leg']['0'][':@']['@_time'];


    let timeStart = new Date("01/01/2022 " + tripStartTime1);
    let timeEnd = new Date("01/01/2022 " + tripEndTime1);

    let timeDiff = timeEnd - timeStart;

    if(timeDiff < 0) {
        timeDiff += 1000*60*60*24;
    }

    let timeDiffHours = Math.floor(timeDiff/1000/60/60);
    let timeDiffMinutes = Math.floor(timeDiff/1000/60) - timeDiffHours*60;


    tripStartTime.innerHTML = tripStartTime1;
    tripEndTime.innerHTML = tripEndTime1;
    if (timeDiffHours > 0){
        tripSpecifiedInfo.innerHTML  = timeDiffHours+" h "+timeDiffMinutes+" min, "+countTripChanges(tripElement)+" changes";
    }else{
        tripSpecifiedInfo.innerHTML  = timeDiffMinutes+" min, "+countTripChanges(tripElement)+" changes";
    } 

}

function getIconElements(tripElement) {
    let iconElement = [];

    tripElement.forEach(element => {
        let tripIconContainer = document.createElement('div');
        tripIconContainer.setAttribute('class', 'trip-icon');
        
        let tripIcon = document.createElement('i');
        let tripName = document.createElement('span');

        switch (element[':@']['@_type']) {
            case "WALK":
                tripIcon.setAttribute('class', 'fa-solid fa-person-walking');
                break;
            case "BUS": case "EXB": case "TOG": case "NB": case "TB":
                tripIcon.setAttribute('class', 'fa-solid fa-bus-simple');
                tripName.innerHTML = element[':@']['@_line'];
                break;
            case "IC": case "LYN": case "REG": case "S": case "M":
                tripIcon.setAttribute('class', 'fa-solid fa-train');
                tripName.innerHTML = element[':@']['@_name'];
                break;
            case "F":
                tripIcon.setAttribute('class', 'fa-solid fa-ferry');
                break;
            default:
                tripIcon.setAttribute('class', 'fa-solid fa-question');
                break;
        }

        tripIconContainer.appendChild(tripIcon);
        tripIconContainer.appendChild(tripName);
        iconElement.push(tripIconContainer);
    });

    return iconElement;
}

function calcIconSpacing(){

}


function countTripChanges(data) {
    let counter = 0;
    
    data.forEach(element => {
        if (element[':@']['@_type'] !== "WALK") {
            counter++;
        }
    });

    return counter-1;
}