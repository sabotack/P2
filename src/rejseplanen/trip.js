import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export { tripAPICall };

async function tripAPICall(parsedData) {
    let resultObject = [];
    const numOfTrips = 5;

    const response = await fetch('http://xmlopen.rejseplanen.dk/bin/rest.exe/trip?originCoordName=' +
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
            parsedData.time
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

    return resultObject;
}
