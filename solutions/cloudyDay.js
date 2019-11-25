//solution as submitted to Hackerrank:
function maximumPeople(p, x, y, r) {
    const cityPopulations = p;
    const cityLocations = x;
    const cloudsLocations = y;
    const cloudsRanges = r;

    let cities = createPopulationMap(cityPopulations, cityLocations); 
    let clouds = createCloudsList(cloudsLocations, cloudsRanges);

    //doesn't really need to return a variable, but it's easier to follow this way?
    cities = citiesWithCloudCoverageCount(cities, clouds);

    let peopleAlreadyInTheSun = cities
        .filter(city => city.cloudsOverMe === 0)
        .map(city => city.population)
        .reduce((a, b) => a + b, 0);

    let citiesUnderASingleLayerOfClouds = [];
    for (let cityIndex in cities) {
        let city = cities[cityIndex];
        if (city.cloudsOverMe === 1) {
            citiesUnderASingleLayerOfClouds[cityIndex] = city;
        }
    }

    let populationsUnderClouds = clouds
        .map(cloud => {
            let peopleUnderOnlyThisCloud = citiesUnderASingleLayerOfClouds
                .slice(cloud.begin < 0 ? 0 : cloud.begin, cloud.end + 1);

            peopleUnderOnlyThisCloud = peopleUnderOnlyThisCloud
                .map(city => city.population)
                .reduce((a, b) => a + b, 0);

            return peopleUnderOnlyThisCloud;
        });

    let largestPopulationToEliberate = Math.max(...populationsUnderClouds);

    return peopleAlreadyInTheSun + largestPopulationToEliberate;
}

function createPopulationMap(cityPopulations, cityLocations) {
    let map = [];
    for (let i = 0; i < cityPopulations.length; i++) {
        let location = cityLocations[i];

        if (!map[location]) {
            map[location] = { population: cityPopulations[i], cloudsOverMe: 0 };
        } else {
            map[location].population += cityPopulations[i];
        }
    }

    return map;
}

function createCloudsList(cloudsLocations, cloudsRanges) {

    let clouds = [...cloudsLocations].map(x => {
        return { location: x }
    });

    for (let i = 0; i < clouds.length; i++) {
        let examinedCloud = clouds[i];
        let range = cloudsRanges[i];
        let location = examinedCloud.location;

        examinedCloud.begin = location - range;
        examinedCloud.end = location + range;
    }
    return clouds;
}

function citiesWithCloudCoverageCount(cities, clouds) {
    clouds.forEach(cloud => {
        let citiesUnderCloud = cities.slice(cloud.begin < 0 ? 0 : cloud.begin, cloud.end + 1);

        citiesUnderCloud.forEach(city => {
                city.cloudsOverMe++;
        });
    });

    return cities;
}

//input-output, so that the response appears on the page:
let p = [10, 100];
let x = [5, 100];
let y = [4, 200];
let r = [1, 1];

/*let p = [10, 1, 8, 3];
let x = [4, 5, 7, 2];
let y = [3, 9, 3, 5];
let r = [11, 10, 8, 7];*/

let solution = maximumPeople(p, x, y, r);
let nodeToAppend2 = "d4";
display(solution, nodeToAppend2);