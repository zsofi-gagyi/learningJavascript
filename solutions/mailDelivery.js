//constant describing the village
const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

//transforming the map into a more usable format
function generateMap(roads) {
    let map = [];
    roads = roads.map(roadString => {
        return roadString.split("-");
    });
    roads.forEach(road => {
        let start = road[0];
        let end = road[1];

        generateConnection(start, end, map);
        generateConnection(end, start, map);
    });

    return map;
}

function generateConnection(start, end, map) {
    let startItemInArray = map.filter(item => item.name === start);
    if (startItemInArray.length) {
        let startObject = startItemInArray[0];
        startObject.neighbours.push(end);
    } else {
        map.push({ name: start, neighbours: [end], goalForParcels: [] });
    }
}

//generating the problem to solve
function generateParcels(map) {
    let remainingParcels = Math.floor(Math.random() * 8) + 3;
    let mapLength = map.length;
    let parcelsList = [];

    while (remainingParcels) {
        let source = map[getRandomIndexBelow(mapLength)];
        let destination;
        do {
            destination = map[getRandomIndexBelow(mapLength)];
        } while (source === destination);

        parcelsList.push([source, destination])
        remainingParcels--;
    }

    return parcelsList;
}

function getRandomIndexBelow(arrayLength) {
    return Math.floor(Math.random() * arrayLength);
}

//solution
function organizeDelivery(parcels, map) {

    //the mail delivery robot always starts at the Post Office
    let path = ["Post Office"];

    parcels.forEach(parcel => {
        map.filter(location => location.name === parcel[0])
            .forEach(location => {
                location.goalForParcels.push(parcel[1]);
                parcels = listWithoutElement(parcels, parcel);
            });
    });

    while (parcels.length) {
        let currentPlace = map.filter(place => place.name === path[path.length - 1])[0];
        pickUpParcels(currentPlace, parcels);

        let nextStep = searchUntilNextPathIsFound(currentPlace);
        path.push(nextStep);
    }

    return path.split(" => ");
}

function pickUpParcels(currentPlace, parcels) {
    let relevantParcels = parcels.filter(parcel => {
        let aaa = parcel[0].name;
        let bbb = currentPlace.name;
        return parcel[0].name === currentPlace.name;
    });

    if (relevantParcels.length) {
        relevantParcels.forEach(parcel => {
            let destination = map.filter(location => location.name === parcel[0])[0];
            destination.goalForParcels.push(parcel[1]);
        });
    }
}

function listWithoutElement(list, element) {
    var index = list.indexOf(element);
    if (index > -1) {
        return list.splice(index, 1);
    }
}

function searchUntilNextPathIsFound(currentPlace) {
    let queue = [...currentPlace.neighbours.map(neighbourName => {
        return map.filter(item => item.name === neighbourName)[0];
    })];

    while (parcels.length && queue.length) {
        let placeExamined = queue.pop();
        if (placeExamined.goalForParcels.length) {
            placeExamined.goalForParcels = [];
            pickUpParcels(placeExamined, parcels);

            return placeExamined;
        } else {
            placeExamined.neighbours.forEach(neighbourName => {
                let neighbourObject = map.filter(item => item.name === neighbourName)[0];

                if (!queue.includes(neighbourObject) && neighbourObject.goalForParcels.length) {
                    queue.push(neighbourObject);
                }
            });
        }
    }

    return currentPlace;
}

/////////////////////////////////////////////////////////
//input-output, so that the response appears on the page:
let map = generateMap(roads);
let parcels = generateParcels(map);

let parcelsString = parcels.map(parcel => {
        return "from " + parcel[0].name + " to " + parcel[1].name;
    })
    .join(", \n");
nodeToAppend = "mailToDeliver";
display(parcelsString, nodeToAppend);

response = organizeDelivery(parcels, map);
nodeToAppend = "d11";
display(response, nodeToAppend);