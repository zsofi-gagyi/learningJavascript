//solution as submitted to Hackerrank:
function organizingContainers(container) {
    let containersList = container;

    let capacities = containersList.map(cont => cont.reduce((a, b) => a + b, 0));

    let colors = [];
    containersList.forEach(cont => {
        for (let containerIndex in cont) {
            let quantity = cont[containerIndex];
            if (quantity) {
                if (colors[containerIndex]) {
                    colors[containerIndex] += quantity;
                } else {
                    colors[containerIndex] = quantity;
                }
            }
        }
    });

    function sortNumber(a, b) {
        return a - b;
    }
    capacities.sort(sortNumber);
    colors.sort(sortNumber);

    for (let commonIndex in capacities) {
        if (capacities[commonIndex] !== colors[commonIndex]) {
            return "Impossible";
        }
    }

    return "Possible";
}

//input-output, so that the response appears on the page:
let solution4 = organizingContainers([[0, 2, 1], [1, 1, 1], [2, 0, 0]]); // possible
//let solution4 = organizingContainers([[12, 0], [1, 11]]); // impossible
let nodeToAppend4 = "d6";
display(solution4, nodeToAppend4);