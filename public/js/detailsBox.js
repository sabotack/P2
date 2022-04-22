export { getDetailedJourney, createDetailsBox };
import { detailServiceCallAPI } from './rejseplanen.js';

function createDetailsBox(tripBox, transportDetailPicked) {
    let details = document.createElement('div');
    details.setAttribute('id', tripBox.id + 'details-List');
    details.setAttribute('class', 'details-List');
    tripBox.appendChild(details);

    let postData = collectDetailURLs(transportDetailPicked);
    postData.forEach((element) => {
        detailServiceCallAPI(element).then((response) => {
            console.log(response);
            response.forEach((element) => {
                let details = document.createElement('div');
                let test = document.createElement('span');
                test.appendChild(details);
                details.appendChild(tripBox);
                for (let i = 0; i < element.length; i++) {
                    test.innerHTML += element[i][':@']['@_name'];
                    test.innerHTML += element[i][':@']['@_depTime'];
                    test.innerHTML += element[i][':@']['@_routeIdx'];
                }
            });
        });
    });
}

function collectDetailURLs(input) {
    let detailURLsObject = [];

    for (let j = 0; j < input.length; j++) {
        let legLength = input[j]['Leg'].length;

        if (legLength >= 4) {
            let url = input[j]['Leg']['3'][':@']['@_ref'];
            detailURLsObject.push(url);
        }
    }

    return detailURLsObject;
}

function getDetailedJourney(inputTrip) {
    //curDetails = document.querySelector()
    detailServiceCallAPI(inputTrip.value).then((response) => {
        showDetails.innerHTML += 'lolol';
    });
}
