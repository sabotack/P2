import { tripServiceCallAPI } from './rejseplanen.js';
import { getDetailedJourney, createDetailsBox } from './detailsBox.js';

export { createTripSelection, createNewTrip, tripSelected };

export function setSelectedTrip(value) {
    tripSelected = value;
}
let tripSelected = '';

function createTripSelection(tripData, tripBox) {
    deleteList(tripBox);

    tripServiceCallAPI(tripData).then((response) => {
        response.forEach((element) => {
            console.log(element.Trip);
            createNewTrip(element.Trip, tripBox);
        });
    });
}

function createNewTrip(tripElement, tripBox) {
    let tripTimeStart = tripElement['0']['Leg']['0'][':@']['@_time'];
    let tripTimeEnd = tripElement[tripElement.length - 1]['Leg']['1'][':@']['@_time'];

    //Create html elements for the trip box
    let trip = document.createElement('div');
    trip.setAttribute('class', 'trip');
    trip.addEventListener('click', () => {
        tripBox.childNodes.forEach((element) => {
            element.classList.remove('trip-selected');
        });

        trip.classList.add('trip-selected');

        let addBtn = tripBox.parentElement.children[2].children[1];
        addBtn.classList.remove('disabled');

        tripSelected = tripElement;
    });

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

    let tripAction = document.createElement('div');
    tripAction.setAttribute('class', 'trip-action');

    let detailsButton = document.createElement('div');
    detailsButton.setAttribute('class', 'details-button');
    detailsButton.append('Details');

    detailsButton.addEventListener('click', () => {
        console.log('clicked on details button');
        let transportDetailPicked = tripElement;
        createDetailsBox(trip, transportDetailPicked);
    });

    //Insert the right elements under the right parent-nodes
    tripBox.appendChild(trip);
    trip.appendChild(tripTop);
    tripTop.appendChild(tripStart);
    tripStart.appendChild(tripStartTime);
    tripTop.appendChild(tripBar);
    tripBar.appendChild(bar);

    let iconSpacings = calcIconSpacings(tripElement, bar.offsetWidth, tripTimeStart, tripTimeEnd);

    getIconElements(tripElement, iconSpacings).forEach((element) => {
        tripBar.appendChild(element);
    });

    tripTop.appendChild(tripEnd);
    tripEnd.appendChild(tripEndTime);
    trip.appendChild(tripInfo);
    tripInfo.appendChild(tripSpecifiedInfo);
    trip.appendChild(tripAction);
    tripAction.appendChild(detailsButton);

    let timeStart = new Date('01/01/2022 ' + tripTimeStart);
    let timeEnd = new Date('01/01/2022 ' + tripTimeEnd);

    let timeDiff = timeEnd - timeStart;

    if (timeDiff < 0) {
        timeDiff += 1000 * 60 * 60 * 24;
    }

    let timeDiffHours = Math.floor(timeDiff / 1000 / 60 / 60);
    let timeDiffMinutes = Math.floor(timeDiff / 1000 / 60) - timeDiffHours * 60;

    tripStartTime.textContent = tripTimeStart;
    tripEndTime.textContent = tripTimeEnd;
    if (timeDiffHours > 0) {
        tripSpecifiedInfo.textContent =
            timeDiffHours + ' h ' + timeDiffMinutes + ' min, ' + countTripChanges(tripElement) + ' changes';
    } else {
        tripSpecifiedInfo.textContent = timeDiffMinutes + ' min, ' + countTripChanges(tripElement) + ' changes';
    }
}

function getIconElements(tripElement, iconSpacings) {
    let iconElement = [];

    let i = 0;
    tripElement.forEach((element) => {
        // If the trip origin includes the destination name or vice versa, then ignore that trip element.
        if (
            i != 0 &&
            (element['Leg']['0'][':@']['@_name']
                .toLowerCase()
                .includes(element['Leg']['1'][':@']['@_name'].toLowerCase()) ||
                element['Leg']['1'][':@']['@_name']
                    .toLowerCase()
                    .includes(element['Leg']['0'][':@']['@_name'].toLowerCase()))
        ) {
            i++;
            return;
        }

        let tripIconContainer = document.createElement('div');
        tripIconContainer.setAttribute('class', 'trip-icon');

        // Icon overlap handling
        /* if(i != 0 && iconSpacings[i] - iconSpacings[i-1] < 35) {
            tripIconContainer.style.setProperty('--icon-space', (iconSpacings[i-1] + 35) + 'px'); i++;
        }
        else {
            tripIconContainer.style.setProperty('--icon-space', iconSpacings[i] + 'px'); i++;
        } */
        tripIconContainer.style.setProperty('left', iconSpacings[i] + '%');
        i++;

        let tripIcon = document.createElement('i');
        let tripName = document.createElement('span');

        //  Switch on trip type, and then set the appropriate icon and text.
        switch (element[':@']['@_type']) {
            case 'WALK':
                tripIcon.setAttribute('class', 'fa-solid fa-person-walking');
                break;
            case 'BUS':
            case 'EXB':
            case 'TOG':
            case 'NB':
            case 'TB':
                tripIcon.setAttribute('class', 'fa-solid fa-bus-simple');
                tripName.textContent = element[':@']['@_line'];
                break;
            case 'IC':
            case 'LYN':
            case 'REG':
            case 'S':
            case 'M':
                tripIcon.setAttribute('class', 'fa-solid fa-train');
                tripName.textContent = element[':@']['@_name'].replace(/\s/g, '');
                break;
            case 'F':
                tripIcon.setAttribute('class', 'fa-solid fa-ferry');
                break;
            default:
                tripIcon.setAttribute('class', 'fa-solid fa-question');
                break;
        }

        // Finally, append the children and push the element in the array.
        tripIconContainer.appendChild(tripIcon);
        tripIconContainer.appendChild(tripName);
        iconElement.push(tripIconContainer);
    });

    // Icon overlap adjustements
    /* for(let i = 0; i < iconElement.length; i++) {
        if(i != 0 && iconElement[i].offsetLeft - iconElement[i-1].offsetLeft < 35) {
            iconElement[i].style.setProperty('left', 'calc(' + iconElement[i-1].offsetLeft + ' + 35px)');
        }
    } */

    return iconElement;
}

function setBarGradient(iconElement, bar) {}

function calcIconSpacings(tripElement, barWidth) {
    const tripTimes = getTripMinutes(tripElement);

    let tripTimesSum = tripTimes.reduce((a, b) => a + b, 0);
    let frac = 100 / tripTimesSum;
    console.log('WIDTH: ' + barWidth);

    let iconSpacings = [];
    let j = 0;
    let time = 0;

    for (let i = 0; i < tripElement.length; i++) {
        if (i == 0) {
            iconSpacings.push(0);
        } else if (i == tripElement.length - 1) {
            iconSpacings.push((time + tripTimes[j]) * frac);
        } else {
            time += tripTimes[j] + tripTimes[j + 1];
            iconSpacings.push(time * frac);
            j += 2;
        }
    }

    return iconSpacings;
}

function getTripMinutes(data) {
    let tripTimes = [];

    data.forEach((element) => {
        tripTimes.push({
            origin: element['Leg']['0'][':@']['@_time'],
            destination: element['Leg']['1'][':@']['@_time']
        });
    });

    let tripTimeDiffs = [];
    let previousDest = 0;
    ('');

    tripTimes.forEach((tripTime) => {
        if (previousDest != 0) {
            let timeDiff = new Date('01/01/2022 ' + tripTime.origin) - new Date('01/01/2022 ' + previousDest);

            if (timeDiff < 0) {
                timeDiff += 1000 * 60 * 60 * 24;
            }
            tripTimeDiffs.push(timeDiff / 1000 / 60);
        }

        let timeDiff = new Date('01/01/2022 ' + tripTime.destination) - new Date('01/01/2022 ' + tripTime.origin);
        if (timeDiff < 0) {
            timeDiff += 1000 * 60 * 60 * 24;
        }
        previousDest = tripTime.destination;
        tripTimeDiffs.push(timeDiff / 1000 / 60);
    });

    return tripTimeDiffs;
}

function countTripChanges(data) {
    let counter = 0;

    data.forEach((element) => {
        if (element[':@']['@_type'] !== 'WALK') {
            counter++;
        }
    });

    return counter - 1;
}

function deleteList(tripBox) {
    tripBox.textContent = '';
}
