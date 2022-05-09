export { getIconElements, calcIconSpacings };

function getIconElements(tripElement, iconSpacings) {
    let iconElement = [];

    let i = 0;
    tripElement.forEach((element) => {
        // If the trip origin includes the destination name or vice versa, then ignore that trip element.
        if ((element['Leg']['0'][':@']['@_name']
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
        tripIconContainer.style.setProperty('left', iconSpacings[i] + '%');
        i++;

        let tripIcon = document.createElement('i');
        let tripName = document.createElement('span');

        //  Switch on trip type, and then set the appropriate icon and text.
        switch (element[':@']['@_type']) {
            case 'WALK':
                tripIcon.setAttribute('class', 'fa-solid fa-person-walking');
                break;
            case 'BUS': case 'EXB': case 'TOG': case 'NB': case 'TB':
                tripIcon.setAttribute('class', 'fa-solid fa-bus-simple');
                tripName.textContent = element[':@']['@_line'];
                break;
            case 'IC': case 'LYN': case 'REG': case 'S': case 'M': case 'LET':
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

    return iconElement;
}

function calcIconSpacings(tripElement) {
    const tripTimes = getTripMinutes(tripElement);

    let tripTimesSum = tripTimes.reduce((a, b) => a + b, 0);
    let frac = 100 / tripTimesSum;

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
