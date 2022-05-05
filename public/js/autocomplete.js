import { createTripSelection } from './tripSelection.js';
import { locationServiceCallAPI, tripServiceCallAPI } from './rejseplanen.js';
import { checkRequiredTransportTo, checkRequiredTransportFrom } from './checks.js';
import { eventLocation, eventStartTime, eventStartDate, eventEndTime, eventEndDate } from './form.js';

export function setEventLocationPicked(value) {
    eventLocationPicked = value;
}

export {
    preEventLocationX,
    preEventLocationY,
    eventLocationX,
    eventLocationY,
    postEventLocationX,
    postEventLocationY,
    inputID,
    eventLocationPicked,
    autocomplete
};

let preEventLocationX = '',
    preEventLocationY = '';
let postEventLocationX = '',
    postEventLocationY = '';
let eventLocationX = '',
    eventLocationY = '';
let inputID = '';
let tripBox = '';
let eventLocationPicked = false;
let tripData = {};

function autocomplete(input) {
    input.addEventListener('input', () => {
        checkRequiredTransportTo();
        checkRequiredTransportFrom();

        deleteList();

        if (input.value == '') {
            return;
        }

        let list = document.createElement('div');
        list.setAttribute('id', input.id + 'autocomplete-list');
        list.setAttribute('class', 'autocomplete-items');
        input.parentNode.appendChild(list);
        locationServiceCallAPI(input.value)
            .then((response) => {
                response.forEach((element) => {
                    let option = document.createElement('div');
                    option.innerHTML += element[':@']['@_name'];
                    option.innerHTML +=
                        "<input type='hidden' value='" +
                        element[':@']['@_name'] +
                        "' data-x='" +
                        element[':@']['@_x'] +
                        "' data-y='" +
                        element[':@']['@_y'] +
                        "' data-input='" +
                        input.id +
                        "'>";

                    option.addEventListener('click', (e) => {
                        let targetInput = e.target.querySelector('input');
                        input.value = targetInput.value;
                        inputID = targetInput.getAttribute('data-input');

                        switch (inputID) {
                            case 'eventlocation':
                                eventLocationX = targetInput.getAttribute('data-x');
                                eventLocationY = targetInput.getAttribute('data-y');
                                eventLocationPicked = true;
                                checkRequiredTransportTo();
                                checkRequiredTransportFrom();
                                break;
                            case 'pre-event-location':
                                preEventLocationX = targetInput.getAttribute('data-x');
                                preEventLocationY = targetInput.getAttribute('data-y');

                                tripData = {
                                    originCoordName: input.value,
                                    originCoordX: preEventLocationX,
                                    originCoordY: preEventLocationY,
                                    destCoordX: eventLocationX,
                                    destCoordY: eventLocationY,
                                    destCoordName: eventLocation.value,
                                    date: eventStartDate.value.split('-').reverse().join('.'),
                                    time: eventStartTime.value,
                                    searchForArrival: 1
                                };
                                tripBox = document.querySelector('#pre-event-trips');

                                createTripSelection(tripData, tripBox);

                                break;
                            case 'post-event-location':
                                postEventLocationX = targetInput.getAttribute('data-x');
                                postEventLocationY = targetInput.getAttribute('data-y');

                                tripData = {
                                    originCoordName: eventLocation.value,
                                    originCoordX: eventLocationX,
                                    originCoordY: eventLocationY,
                                    destCoordX: postEventLocationX,
                                    destCoordY: postEventLocationY,
                                    destCoordName: input.value,
                                    date: eventEndDate.value.split('-').reverse().join('.'),
                                    time: eventEndTime.value,
                                    searchForArrival: 0
                                };
                                tripBox = document.querySelector('#post-event-trips');

                                createTripSelection(tripData, tripBox);

                                break;
                        }

                        deleteList();
                    });

                    list.appendChild(option);
                });
            })
            .catch((error) => console.log(error));
    });
}

function deleteList() {
    let list = document.querySelector('.autocomplete-items');
    if (list != null) {
        list.remove();
    }
}
