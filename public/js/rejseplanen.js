export { locationServiceCallAPI };

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
