import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export { locationAPICall };

async function locationAPICall(inputLocation) {
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

    // console.log(JSON.stringify(result[1][':@']));

    let resultObject = [result[0], result[1], result[2], result[3]];

    return resultObject;
}
