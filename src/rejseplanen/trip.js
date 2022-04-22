import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export { tripAPICall };

async function tripAPICall(parsedData) {
    let resultObject = [];
    const numOfTrips = 5;

    const response = await fetch(
        'http://xmlopen.rejseplanen.dk/bin/rest.exe/trip?originCoordName=' +
            parsedData.originCoordName +
            '&originCoordX=' +
            parsedData.originCoordX +
            '&originCoordY=' +
            parsedData.originCoordY +
            '&destCoordX=' +
            parsedData.destCoordX +
            '&destCoordY=' +
            parsedData.destCoordY +
            '&destCoordName=' +
            parsedData.destCoordName +
            '&date=' +
            parsedData.date +
            '&time=' +
            parsedData.time +
            '&searchForArrival=' +
            parsedData.searchForArrival
    );

    const data = await response.text();

    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        preserveOrder: true
    };
    const parser = new XMLParser(options);

    // This removes the first 2 lines of the response to remove the special XML addatives
    let splitText = data.split('\n');
    splitText.splice(0, 2);
    let result = parser.parse(splitText.join('\n'));

    for (let i = 0; i < result.length && i < numOfTrips; i++) {
        resultObject.push(result[i]);
    }

    resultObject = removeBaseURL(resultObject);

    return resultObject;
}

function removeBaseURL(input) {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i]['Trip'].length; j++) {
            let legLength = input[i]['Trip'][j]['Leg'].length;

            if (legLength >= 4) {
                let tempString = input[i]['Trip'][j]['Leg']['3'][':@']['@_ref'];
                input[i]['Trip'][j]['Leg']['3'][':@']['@_ref'] = tempString.replace(
                    'http://webapp.rejseplanen.dk/bin//rest.exe/',
                    ''
                );
            }
        }
    }

    return input;
}
