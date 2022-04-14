export { locationServiceCallAPI, tripServiceCallAPI };

function locationServiceCallAPI(inputField) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/locationService', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send('location=' + inputField);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let result = JSON.parse(xhr.responseText);
                this.status == 200 ? resolve(result) : reject('Error');
            }
        };
    });
}

function tripServiceCallAPI(tripData) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/tripService', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send('originCoordName='+
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
            tripData.time);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let result = JSON.parse(xhr.responseText);
                this.status == 200 ? resolve(result) : reject('Error');
            }
        };
    });
}