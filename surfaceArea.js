//solution as submitted to Hackerrank:
function surfaceArea(A) {
    const width = A.length;
    const length = A[0].length;
    const topAndBottom = width * length * 2;

    A = surroundWithZeros(A);
    const verticalAreas = countDifferences(A, width, length);
  
    return topAndBottom + verticalAreas;
}

function surroundWithZeros(A) {
    const side = Array(A[0].length + 2).fill(0);
    const middleRows = A.map(row => [0, ...row, 0]);
    return [side, ...middleRows, side];
}

function countDifferences(A, width, length) {
    let diff = 0;

    for (let i = 1; i < width + 1; i++) {
        for (let j = 1; j < length + 1; j++) {

            const square = A[i][j];
            const neighbours = [
                A[i + 1][j],
                A[i - 1][j],
                A[i][j + 1],
                A[i][j - 1]
            ];

            neighbours.forEach(neighbour => {
                if (square > neighbour) {
                    diff += square - neighbour;
                }
            })
        }
    }

    return diff;
}

//input-output, so that the response appears on the page:
let A = [[1, 3, 4], [2, 2, 3], [1, 2, 4]];

let response = surfaceArea(A);
let nodeToAppend = "d1";
display(response, nodeToAppend);