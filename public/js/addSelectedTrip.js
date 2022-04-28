import { checkRequiredTransportTo, checkRequiredTransportFrom } from './checks.js';
import { eventLocation, addToBtn, eventStartDate, eventStartTime, eventEndDate, eventEndTime, events } from './form.js';

export { addSelectedTrip };

function addSelectedTrip(locationInput, button, selectedTripObject) {
    if (button.parentElement.children[1]) {
        button.parentElement.children[1].remove();
    }

    button.textContent = '';
    button.classList.add('event-selected');

    let transportRemove = document.createElement('div');
    transportRemove.classList.add('transport-remove');

    let removeIcon = document.createElement('i');
    removeIcon.classList.add('fa-solid', 'fa-xmark', 'fa-xl');

    let transportTitle = document.createElement('p');
    transportTitle.classList.add('transport-title');
    transportTitle.textContent = button === addToBtn ? 'Pre-event transport' : 'Post-event transport';

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

    eventLocation.addEventListener(
        'input',
        () => {
            if (button.parentElement.children[1]) {
                removeTransport(button);
            }
            checkRequiredTransportFrom();
            checkRequiredTransportTo();
        },
        { once: true }
    );

    transportRemove.addEventListener('click', () => {
        removeTransport(button);
    });

    // Button specific functions
    if (button === addToBtn) {
        eventLocationText.textContent = selectedTripObject[0]['Leg'][0][':@']['@_name'];

        eventStartDate.addEventListener(
            'input',
            () => {
                if (button.parentElement.children[1]) {
                    removeTransport(button);
                }
            },
            { once: true }
        );

        eventStartTime.addEventListener(
            'input',
            () => {
                if (button.parentElement.children[1]) {
                    removeTransport(button);
                }
            },
            { once: true }
        );
    } else {
        let lastTrip = selectedTripObject.length - 1;
        eventLocationText.textContent = selectedTripObject[lastTrip]['Leg'][0][':@']['@_name'];

        eventEndDate.addEventListener(
            'input',
            () => {
                if (button.parentElement.children[1]) {
                    removeTransport(button);
                }
            },
            { once: true }
        );

        eventEndTime.addEventListener(
            'input',
            () => {
                if (button.parentElement.children[1]) {
                    removeTransport(button);
                }
            },
            { once: true }
        );
    }
}

function removeTransport(button) {
    button.innerHTML = '';
    button.classList.remove('event-selected');
    button.parentElement.children[1].remove();

    let p = document.createElement('p');
    if (button === addToBtn) {
        p.textContent = '+ add pre-event transport';
        events.splice(0);
    } else {
        p.textContent = '+ add post-event transport';
        events.splice(2);
    }
    button.appendChild(p);
}
