export {getDetailedJourney};
import {detailServiceCallAPI} from './rejseplanen.js'

function createDetailsBox(tripBox){
    let details = document.createElement('div');
    details.setAttribute('id', inputTrip.id + 'details-List');
    details.setAttribute('class', 'details-List');
    inputTrip.parentNode.appendChild(details);
}

function getDetailedJourney(inputTrip){
    //curDetails = document.querySelector()
    detailServiceCallAPI(inputTrip.value).then(
        (response) => {
            showDetails.innerHTML += "lolol"
        });

};