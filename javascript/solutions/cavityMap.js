//solution as submitted to Hackerrank:
function cavityMap(grid) {

    gridOfNodes = unpackInNodes(grid);
    updateAllNodesWithCavities(gridOfNodes);

    return stringifyResult(gridOfNodes);
}

function unpackInNodes(grid) {
    return grid.map(row => {

        return row.split("")
            .map(digit => {
                return { value: parseInt(digit), checked: false }
            });
    }); 
}

function updateAllNodesWithCavities(gridOfNodes) {
    for (let rowIndex = 1; rowIndex < gridOfNodes.length - 1; rowIndex++) {
        let row = gridOfNodes[rowIndex];

        for (let nodeIndex = 1; nodeIndex < gridOfNodes.length - 1; nodeIndex++) {
            let node = row[nodeIndex];

            if (!node.checked) {
                let neighbours = findNeighbours(gridOfNodes, rowIndex, nodeIndex); 

                updateWithCavities(node, neighbours);
            }
        }
    }
}

function isNotFirstOrLastRow(row, gridLength) {
    let firstElement = row[0];
    return (firstElement.rowIndex !== 0 &&
            firstElement.rowIndex !== gridLength - 1);
}

function isNotFirstOrLastNode(node, rowLength) {
    return (node.nodeIndex !== 0 &&
            node.nodeIndex !== rowLength - 1);
}

function findNeighbours(gridOfNodes, rowIndex, nodeIndex) {
    return [
        gridOfNodes[rowIndex][nodeIndex - 1],
        gridOfNodes[rowIndex][nodeIndex + 1],
        gridOfNodes[rowIndex - 1][nodeIndex],
        gridOfNodes[rowIndex + 1][nodeIndex]
    ];
}

function updateWithCavities(node, neighbours) {
    let cavity = true;

    for (neighbour of neighbours) {
        if (neighbour.value >= node.value) {
            cavity = false;
            break;
        }
    }

    if (cavity) {
        node.value = "X";

        let toChange = [node, ...neighbours];
        toChange.forEach(node => {
            node.checked = true;
        })
    }
}

function stringifyResult(gridOfNodes) {
    return gridOfNodes.map(row => {
        let rowString = "";
        row.forEach(node => rowString += node.value);
        return rowString;
    });
}

//input-output, so that the response appears on the page:
let solution8 = cavityMap(["1112", "1912", "1892", "1234"]);
let nodeToAppend8 = "d8";
display(solution8, nodeToAppend8);