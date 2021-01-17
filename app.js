const service = new google.maps.DistanceMatrixService();
let destContainer = document.getElementById('destinations-container');

var fieldRowCounter = 0;
addRow();

document.getElementById('addLocation').addEventListener('click', () => {
    addRow();
});

let destinationNames = [];
originName = "";

document.getElementById('submitBtn').addEventListener('click', () => {
    destinationNames = [];

    let origin = document.getElementById('originAddress').value;
    originName = document.getElementById('originName').value;

    let destinations = [];

    destContainer.childNodes.forEach(destination => {
        destinations.push(destination.childNodes[0].firstChild.value);
        destinationNames.push(destination.childNodes[1].firstChild.value);
    });

    getData(origin, destinations);
});

function addRow() {
    // create row
    let rowId = `fieldRow${fieldRowCounter}`;
    let row = document.createElement('div');
    row.classList.add('row', 'pe-3', 'mt-2');
    row.id = rowId;

    // create field 1
    let field1Div = document.createElement('div');
    field1Div.classList.add('col-5');
    field1Div.innerHTML = '<input type="text" class="form-control" placeholder="Address">';


    // create field 2
    let field2Div = document.createElement('div');
    field2Div.classList.add('col-5', 'ps-0');
    field2Div.innerHTML = '<input type="text" class="form-control" placeholder="Property Name">';

    // create delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('col-2', 'm-auto', 'btn', 'btn-outline-danger');
    deleteButton.type = 'button';
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

    deleteButton.addEventListener('click', () => {
        row.remove();
    });

    // add to row
    row.appendChild(field1Div);
    row.appendChild(field2Div);
    row.appendChild(deleteButton);

    // add to destContainer
    destContainer.appendChild(row);

    fieldRowCounter++;
}

function getData(origin, destinations) {
    service.getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
    }, callback);
}

function callback(response, status) {
    if (status !== "OK") {
        alert("Error was: " + status);
    } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;

        let tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = "";

        document.getElementById('tableModalLabel').innerText = `From ${originName}, to...`;

        var destinationCounter = 0;
        
        response["rows"][0]["elements"].forEach(element => {
            let distance = element["distance"]["text"];
            let time = element["duration"]["text"];

            // row
            let row = document.createElement('tr');

            // destination name cell
            let destCell = document.createElement('td');
            destCell.innerText = destinationNames[destinationCounter++];

            // distance cell
            let distCell = document.createElement('td');
            distCell.innerText = distance;

            // time cell
            let timeCell = document.createElement('td');
            timeCell.innerText = time;

            row.appendChild(destCell);
            row.appendChild(distCell);
            row.appendChild(timeCell);

            tableBody.appendChild(row);
        });


        var myModal = new bootstrap.Modal(document.getElementById('tableModal'), {});
        myModal.show();
    }
}