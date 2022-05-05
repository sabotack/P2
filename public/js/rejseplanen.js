export { locationServiceCallAPI, tripServiceCallAPI };

function locationServiceCallAPI(inputField) {
    return fetch('http://localhost:3000/locationService', {
        //returns promise, and then proceeds to fetch server.
        method: 'POST',
        headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'location=' + inputField //body contains stringified events in order to send accross network
    })
        .then((response) => {
            if (!response.ok) {
                const e = new Error(response.statusText);
                e.code = response.status;
                throw e;
            }
            //when response is recieved, convert it to json.
            return response.json();
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function tripServiceCallAPI(tripData) {
    return fetch('http://localhost:3000/tripService', {
        //returns promise, and then proceeds to fetch server.
        method: 'POST',
        headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body:
            'originCoordName=' +
            tripData.originCoordName +
            '&originCoordX=' +
            tripData.originCoordX +
            '&originCoordY=' +
            tripData.originCoordY +
            '&destCoordX=' +
            tripData.destCoordX +
            '&destCoordY=' +
            tripData.destCoordY +
            '&destCoordName=' +
            tripData.destCoordName +
            '&date=' +
            tripData.date +
            '&time=' +
            tripData.time +
            '&searchForArrival=' +
            tripData.searchForArrival //body contains stringified events in order to send accross network
    })
        .then((response) => {
            if (!response.ok) {
                const e = new Error(response.statusText);
                e.code = response.status;
                throw e;
            }

            //when response is recieved, convert it to json.
            return response.json();
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
