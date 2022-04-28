import * as form from './form.js';
import { eventLocationPicked } from './autocomplete.js';

export { checkRequiredTransportTo, checkRequiredTransportFrom };

function checkRequiredTransportTo() {
    if (
        form.eventStartDate.value != '' &&
        form.eventStartTime.value != '' &&
        form.eventLocation.value != '' &&
        eventLocationPicked
    ) {
        form.addToBtn.classList.remove('disabled');
    } else {
        form.addToBtn.classList.add('disabled');
    }
}

function checkRequiredTransportFrom() {
    if (
        form.eventEndDate.value != '' &&
        form.eventEndTime.value != '' &&
        form.eventLocation.value != '' &&
        eventLocationPicked
    ) {
        form.addFromBtn.classList.remove('disabled');
    } else {
        form.addFromBtn.classList.add('disabled');
    }
}
