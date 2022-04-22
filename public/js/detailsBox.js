export { getDetailedJourney, createDetailsBox };
import { detailServiceCallAPI } from './rejseplanen.js';

function createDetailsBox(trip, transportDetailPicked) {
    let details = document.createElement('div');
    details.setAttribute('id', trip.id + 'details-List');
    details.setAttribute('class', 'details-content');
    trip.after(details);
    let test = document.createElement('p');
    details.appendChild(test);

    let postData = collectDetailURLs(transportDetailPicked);
    postData.forEach((element) => {
        detailServiceCallAPI(element).then((response) => {
            console.log(response);
            response.forEach((element) => {
                if ('Stop' in element){
                    console.log(element); 
                    test.innerHTML += "Stop Name: <b>"+element[':@']['@_name']+'</b> ';
                    if ('@_depTime' in element[':@']){
                        test.innerHTML += "Departue Time: <b>"+element[':@']['@_depTime']+'</b> ';
                    }
                    else{
                        test.innerHTML += "Arrival Time: <b>"+element[':@']['@_arrTime']+'</b> ';
                    }
                    //test.innerHTML += "route: "+element[':@']['@_routeIdx']+' ';
                    test.innerHTML += '<br>';
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
