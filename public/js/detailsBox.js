export { getDetailedJourney, createDetailsBox };
import { detailServiceCallAPI } from './rejseplanen.js';

function createDetailsBox(trip, transportDetailPicked) {
    let details = document.createElement('div');
    details.setAttribute('id', trip.id + 'details-List');
    details.setAttribute('class', 'details-content');
    trip.after(details);
    let test = document.createElement('p');
    test.setAttribute('class', 'details-info');
    details.appendChild(test);

    let postData = collectDetailURLs(transportDetailPicked);
    postData.forEach((element) => {
        detailServiceCallAPI(element).then((response) => {
            console.log(response);
            response.forEach((element) => {
                if ('Stop' in element){ 
                    test.innerHTML += "Stop Name: <b>"+element[':@']['@_name']+'</b> ';
                    if ('@_depTime' in element[':@']){
                        test.innerHTML += "Departure Time: <b>"+element[':@']['@_depTime']+'</b> ';
                    }
                    else if('@_arrTime' in element[':@']){
                        test.innerHTML += "Arrival Time: <b>"+element[':@']['@_arrTime']+'</b> ';
                    }
                    else{
                        console.log("nothing");
                    }
                    //test.innerHTML += "route: "+element[':@']['@_routeIdx']+' ';
                    test.innerHTML += '<br>';
                }
            });
        });
    });

    details.style.display = "show";

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
