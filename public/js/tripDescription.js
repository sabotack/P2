export { transportDescriptionCreator };

function transportDescriptionCreator(trip) {
    let description = '';

    for (let i = 0; i < trip.length; i++) {
        description +=
            'Travel time: <b>' +
            trip[i]['Leg'][0][':@']['@_time'] +
            ' </b>' +
            '→' +
            '<b> ' +
            trip[i]['Leg'][1][':@']['@_time'] +
            '</b><br>';
        description += 'Origin: <b>' + trip[i]['Leg'][0][':@']['@_name'] + '</b><br>';

        if (trip[i][':@']['@_type'] == 'WALK') {
            description += 'Transportation type: <b>' + trip[i][':@']['@_type'] + '</b><br>';
        } else {
            description += 'Transportation name: <b>' + trip[i][':@']['@_name'] + '</b><br>';
        }

        description += 'Destination: <b>' + trip[i]['Leg'][1][':@']['@_name'] + '</b><br>';

        if (i !== trip.length - 1) {
            description += '<br>';
        }
    }

    return description;
}

