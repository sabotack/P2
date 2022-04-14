import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export { tripAPICall };

let parsedData = {
    originCoordName: 'Sigrid Undsets Vej 196B',
    originCoordX: '9990189',
    originCoordY: '57017220',
    destCoordX: '9912378',
    destCoordY: '57053150',
    destCoordName: 'Vestre Kanal Gade',
    date: '15.04.22',
    time: '07:02'
};

async function tripAPICall(parsedData) {
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

    // console.log(JSON.stringify(result[1][':@']));

    let resultObject = [result[0], result[1], result[2], result[3]];

    console.log(JSON.stringify(resultObject));

    return resultObject;
}
