import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export { locationAPICall };

async function locationAPICall(inputLocation) {
    if(inputLocation.length > 51) {
        throw(new Error('Location name too long'));
    }

    let resultObject = [];
    const numOfLocations = 4;
    const response = await fetch('http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=' + inputLocation);
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

    for (let i = 0; i < result.length && i < numOfLocations; i++) {
        resultObject.push(result[i]);
    }

    return resultObject;
}
