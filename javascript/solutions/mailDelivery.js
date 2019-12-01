/////////////////////////////////////////////////////////
//input-output, so that the response appears on the page:
let map = generateMap();
const parcels = generateParcels(map);

//for testing purposes
/*const parcels = generateFakeParcels(map);

function generateFakeParcels(map) {
    let parcels = [];
    let firstStart = map.filter(item => item.name[0] === "G")[0];
    let firstEnd = map.filter(item => item.name[0] === "A")[0];
    parcels.push({ from: firstStart, to: firstEnd });

    let secondStart = map.filter(item => item.name[0] === "F")[0];
    let secondEnd = map.filter(item => item.name[0] === "D")[0];
    parcels.push({ from: secondStart, to: secondEnd });

    return parcels;
}*/

let parcelsString = "today's parcels: " + parcels.map(parcel => {
    return "from " + parcel.from.name + " to " + parcel.to.name;
})
    .join(", ");
nodeToAppend = "mailToDeliver";
display(parcelsString, nodeToAppend);

//the robot always starts its trip from the post office
map = markLocationsWithPackagesToPickUpAsMustBeReached(map, parcels);

let currentLocation = map.filter(item => item.name === "Post Office")[0];
let placesVisitedBefore = [];
let parcelsCarried = [];

response = organizeDelivery(parcels, map, currentLocation, placesVisitedBefore, parcelsCarried);
nodeToAppend = "d11";
display(response.join(" => "), nodeToAppend);

////////////////////////////////////////////////////////////
//1. creating the map 
function generateMap() {

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

    let map = [];

    roads.map(roadString => {
            return roadString.split("-");
        })
        .forEach(road => {
            const start = road[0];
            const end = road[1];

            map = mapWithAddedConnection(start, end, map);
            map = mapWithAddedConnection(end, start, map);
        });

    map = replaceNeighbourStringsWithNeighbourObjects(map);

    return map;
}

function mapWithAddedConnection(start, end, map) {
    const startItemInArray = map.filter(item => item.name === start);

    if (startItemInArray.length) {
        const startObject = startItemInArray[0];
        startObject.neighbours.push(end);
    } else {
        map.push({ name: start, neighbours: [end], mustBeReached: false });
    }

    return map;
}

function replaceNeighbourStringsWithNeighbourObjects(map) {
    let newMap = [];

    map.forEach(item => {
        item.neighbours = item.neighbours.map(neighbour => {
            return map.filter(item => item.name === neighbour)[0];
        });
        newMap.push(item);
    });

    return newMap;
}

//2. generating the problem to solve
function generateParcels(map) {
    let remainingParcels = Math.floor(Math.random() * 4) + 1;
    let mapLength = map.length;
    let parcelsList = [];

    while (remainingParcels) {
        let source = map[getRandomIndexBelow(mapLength)];
        let destination;
        do {
            destination = map[getRandomIndexBelow(mapLength)];
        } while (source === destination);

        parcelsList.push({ from: source, to: destination });
        remainingParcels--;
    }

    return parcelsList;
}

function getRandomIndexBelow(arrayLength) {
    return Math.floor(Math.random() * arrayLength);
}

//3. put initial goals on the map
function markLocationsWithPackagesToPickUpAsMustBeReached(map, parcels) {
    parcels.forEach(parcel => {
        let initialLocation = parcel.from;
        initialLocation.mustBeReached = true;
    });

    return map;
}

//3. solution
//3.a. the main function that works recursively
function organizeDelivery(parcels, map, currentLocation, placesVisitedBefore, parcelsCarried) {
    placesVisitedBefore.push(currentLocation.name);
    updatedPlacesVisitedBefore = placesVisitedBefore; // yes it has been updated...

    let remainingParcels = parcels.filter(parcel => parcel.from !== currentLocation);

    let parcelsCarriedUpdatedWithPickingUp =
            parcelsUpdatedWithPickingUpFromCurrentLocation(currentLocation, parcels, parcelsCarried);
    let updatedParcelsCarried = parcelsAfterDeliveringIfPossible(currentLocation, parcelsCarriedUpdatedWithPickingUp);

    let updatedMap = updateMapBasedOnParcelsCarried(map, updatedParcelsCarried, remainingParcels);

    const locationsToBeReached = updatedMap.filter(item => item.mustBeReached);
    if (!locationsToBeReached.length) {
        return updatedPlacesVisitedBefore;
    }

    let nextLocation = findNextLocation(updatedMap, currentLocation);

    return organizeDelivery(remainingParcels, updatedMap, nextLocation, updatedPlacesVisitedBefore, updatedParcelsCarried);
}

//3.b. helper functions to 3.a.
function parcelsUpdatedWithPickingUpFromCurrentLocation(currentLocation, parcels, parcelsCarried) {
    let parcelsToPickUp = parcels.filter(parcel => parcel.from === currentLocation);

    if (parcelsToPickUp.length) {
        parcelsToPickUp.forEach(parcel => {
            parcelsCarried.push(parcel);
        });
    }

    return parcelsCarried;
}

function parcelsAfterDeliveringIfPossible(currentLocation, parcelsCarried) {
    let deliverables = parcelsCarried.filter(parcel => parcel.to === currentLocation);
    if (deliverables.length) {
        deliverables.forEach(parcel => {
            parcelsCarried = parcelsCarried.slice(parcelsCarried.indexOf(parcel), 1); // remove element
        });
    }

    return parcelsCarried;
}

function parcelsAfterDeliveringIfPossible(currentLocation, parcelsCarried) {
    return parcelsCarried.filter(parcel => parcel.to.name !== currentLocation.name);
}

function updateMapBasedOnParcelsCarried(map, parcelsCarried, remainingParcels) {
    map.forEach(item => item.mustBeReached = false);
    let mapWithRemainingToPickUp = markLocationsWithPackagesToPickUpAsMustBeReached(map, remainingParcels);
    let mapAfterPickups = updateMapBasedOnPickups(mapWithRemainingToPickUp, parcelsCarried);
    let mapAfterPickupsAndDeliveries = updateMapBasedOnDeliveries(mapAfterPickups, parcelsCarried, remainingParcels);

    return mapAfterPickupsAndDeliveries;
}

function updateMapBasedOnPickups(map, parcelsCarried) {
    map.forEach(location => {
        if (location.mustBeReached) {
            let alreadyPickedUpParcelsFromHere = parcelsCarried.filter(parcel => {
                return parcel.from === location;
            })
                .length > 0;

            let needsToDeliverPacketsHere = parcelsCarried.filter(parcel => {
                return parcel.to === location;
            })
                .length > 0;

            if (alreadyPickedUpParcelsFromHere && !needsToDeliverPacketsHere) {
                location.mustBeReached = false;
            }
        }
    });

    return map;
}

function updateMapBasedOnDeliveries(map, parcelsCarried) {
    map.forEach(location => {
        let needsToDeliverPacketsHere = parcelsCarried.filter(parcel => {
            return parcel.to === location;
        })
            .length > 0;

        if (needsToDeliverPacketsHere) {
            location.mustBeReached = true;
        } 
    });

    return map;
}

function findNextLocation(map, currentLocation) {
    let mapForPathfinding = constructMapForPathFinding(map);

    let currentLocationInCorrectFormat = mapForPathfinding.filter(item => item.name === currentLocation.name)[0];

    let possibleSteps = [...currentLocationInCorrectFormat.neighbours];

    possibleSteps = possibleSteps.map(place => {
        mapForPathfinding.forEach(item => item.visited = false);
        return { location: place, distanceUntilATarget: distanceUntilATarget(place, 0) };
    });

    let neighbourToChose = possibleSteps.reduce((a, b) =>
        a.distanceUntilATarget > b.distanceUntilATarget ? b : a).location;

    return map.filter(location => location.name === neighbourToChose.name)[0];
}

function constructMapForPathFinding(map) {
    let mapForPathfindingWithNeighbourStrings = map.map(location => {
        return {
            name: location.name,
            neighbours: location.neighbours.map(neighbour => neighbour.name),
            mustBeReached: location.mustBeReached,
            visited: false
        };
    });

    return replaceNeighbourStringsWithNeighbourObjects(mapForPathfindingWithNeighbourStrings);
}

function distanceUntilATarget(location, stepsAlreadyTaken) {
    if (location.mustBeReached) {
        return stepsAlreadyTaken;
    }

    let queue = location.neighbours.slice();

    while (true) {
        let placeToEvaluate = queue.shift();
        if (placeToEvaluate.mustBeReached) {
            return stepsAlreadyTaken + 1;

        } else {
            placeToEvaluate.visited = true;
            placeToEvaluate.neighbours.forEach(neighbour => {
                if (!neighbour.visited) {
                    queue.push(neighbour);
                }
            });
            stepsAlreadyTaken++;
        }
    }
}