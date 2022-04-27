export { createDetailsBox };
import { detailServiceCallAPI } from './rejseplanen.js';

function createDetailsBox(trip, transportDetailPicked) {
    let details = document.createElement('div');
    details.setAttribute('class', 'details-content');
    trip.after(details);
    let test = document.createElement('p');
    test.setAttribute('class', 'details-info');
    details.appendChild(test);
    details.style.display = 'none';
    /*let postData = collectDetailURLs(transportDetailPicked);
    postData.forEach((element) => {
        detailServiceCallAPI(element).then((response) => {
            
            console.log(response);

            response.forEach((element) => {
                if ('Stop' in element) {
                    test.innerHTML += 'Stop Name: <b>' + element[':@']['@_name'] + '</b> ';
                    if ('@_depTime' in element[':@']) {
                        test.innerHTML += 'Departure Time: <b>' + element[':@']['@_depTime'] + '</b> ';
                    } else if ('@_arrTime' in element[':@']) {
                        test.innerHTML += 'Arrival Time: <b>' + element[':@']['@_arrTime'] + '</b> ';
                    } else {
                    }
                    //test.innerHTML += "route: "+element[':@']['@_routeIdx']+' ';
                    test.innerHTML += '<br>';
                }
            });
            details.style.display = 'block';
        });
    });*/

    for (let i = 0; i < transportDetailPicked.length; i++) {
        test.innerHTML +=
            'Travel time: <b>' +
            transportDetailPicked[i]['Leg'][0][':@']['@_time'] +
            ' </b>' +
            '→' +
            '<b> ' +
            transportDetailPicked[i]['Leg'][1][':@']['@_time'] +
            '</b><br>';
        test.innerHTML += 'Origin: <b>' + transportDetailPicked[i]['Leg'][0][':@']['@_name'] + '</b><br>';

        if (transportDetailPicked[i][':@']['@_type'] == 'WALK') {
            test.innerHTML += 'Transportation type: <b>' + transportDetailPicked[i][':@']['@_type'] + '</b><br>';
        } else {
            test.innerHTML += 'Transportation name: <b>' + transportDetailPicked[i][':@']['@_name'] + '</b><br>';
        }

        test.innerHTML += 'Destination: <b>' + transportDetailPicked[i]['Leg'][1][':@']['@_name'] + '</b><br>';
        //test.innerHTML += 'Destination time: <b>' + transportDetailPicked[i]['Leg'][1][":@"]["@_time"]+'</b><br>';
        //test.innerHTML += 'Destination: <b>' + transportDetailPicked[i]['Leg'][1][":@"]["@_name"]+'</b><br>';
        //test.innerHTML += 'Transportation type: <b>' + transportDetailPicked[i]['Leg'][1][":@"]["@_type"]+'</b><br>';

        if (i !== transportDetailPicked.length - 1) {
            test.innerHTML += '<br>';
        }
    }

    details.style.display = 'block';
    console.log(transportDetailPicked);
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
