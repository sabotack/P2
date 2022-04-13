import { locationServiceCallAPI } from "./rejseplanen.js";
import { checkRequiredTransportTo, checkRequiredTransportFrom } from "./checks.js";

export { preEventLocationX, preEventLocationY, eventLocationX, eventLocationY, postEventLocationX, postEventLocationY, inputID};
export {autocomplete};

let preEventLocationX = '', preEventLocationY = '';
let eventLocationX = '', eventLocationY = '';
let postEventLocationX = '', postEventLocationY = '';
let inputID = '';

function autocomplete(input) { 

    input.addEventListener('input', () => {
        checkRequiredTransportTo();
        checkRequiredTransportFrom();

        deleteList();

        if (input.value == '') {
            return;
        }

        let list = document.createElement("div");
        list.setAttribute("id", input.id + "autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        input.parentNode.appendChild(list);


        locationServiceCallAPI(input.value).then((response) => {

            response.forEach(element => {
                let option = document.createElement("div");
                option.innerHTML += element[':@']['@_name'];
                option.innerHTML += "<input type='hidden' value='" + element[':@']['@_name'] + 
                                                        "' data-x='" + element[':@']['@_x'] +
                                                        "' data-y='"+ element[':@']['@_y'] +
                                                        "' data-input='"+ input.id +"'>"
                
                option.addEventListener("click", (e) => {
                    let targetInput = e.target.querySelector('input');
                    input.value = targetInput.value;
                    inputID = targetInput.getAttribute('data-input');
                    
                    switch(inputID) {
                        case 'eventlocation':
                            eventLocationX = targetInput.getAttribute('data-x');
                            eventLocationY = targetInput.getAttribute('data-y');
                            break;
                        case 'pre-event-location':
                            preEventLocationX = targetInput.getAttribute('data-x');
                            preEventLocationY = targetInput.getAttribute('data-y');
                            break;
                        case 'post-event-location':
                            postEventLocationX = targetInput.getAttribute('data-x');
                            postEventLocationY = targetInput.getAttribute('data-y');
                            break;
                    }
                    
                    console.log("input: " + inputID + "\n" +
                                "pre-X: " + preEventLocationX + " pre-Y: " + preEventLocationY + "\n" +
                                "event-X: " + eventLocationX + " event-Y: " + eventLocationY + "\n" +
                                "post-X: " + postEventLocationX + " post-Y: " + postEventLocationY);

                    deleteList();
                }); 
                
                list.appendChild(option);
            });

        }, (err) => {
            console.log(err);
        });

    });
}

function deleteList() {
    let list = document.querySelector('.autocomplete-items');
    if (list != null) {
        list.remove();
    }
}