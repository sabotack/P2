import { detailServiceCallAPI } from './rejseplanen.js';

export { createDetailsBox };

function createDetailsBox(trip, transportDetailPicked) {
    let details = document.createElement('div');
    details.setAttribute('class', 'details-content');
    trip.after(details);

    let detailsInfo = document.createElement('p');
    detailsInfo.setAttribute('class', 'details-info');
    details.appendChild(detailsInfo);
    details.style.display = 'none';

    for (let i = 0; i < transportDetailPicked.length; i++) {
        detailsInfo.innerHTML +=
            'Travel time: <b>' +
            transportDetailPicked[i]['Leg'][0][':@']['@_time'] +
            ' </b>' +
            '→' +
            '<b> ' +
            transportDetailPicked[i]['Leg'][1][':@']['@_time'] +
            '</b><br>';
        detailsInfo.innerHTML += 'Origin: <b>' + transportDetailPicked[i]['Leg'][0][':@']['@_name'] + '</b><br>';

        if (transportDetailPicked[i][':@']['@_type'] == 'WALK') {
            detailsInfo.innerHTML += 'Transportation type: <b>' + transportDetailPicked[i][':@']['@_type'] + '</b><br>';
        } else {
            detailsInfo.innerHTML += 'Transportation name: <b>' + transportDetailPicked[i][':@']['@_name'] + '</b><br>';
        }

        detailsInfo.innerHTML += 'Destination: <b>' + transportDetailPicked[i]['Leg'][1][':@']['@_name'] + '</b><br>';

        if (i !== transportDetailPicked.length - 1) {
            detailsInfo.innerHTML += '<br>';
        }
    }

    details.style.display = 'block';
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
