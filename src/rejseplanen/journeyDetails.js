import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export { detailAPICall };

async function detailAPICall(inputDetailURL) {
    let resultObject = [];
    const response = await fetch('http://webapp.rejseplanen.dk/bin//rest.exe/' + inputDetailURL);
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

    return result;
}
