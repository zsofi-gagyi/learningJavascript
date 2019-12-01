//solution as submitted to Hackerrank:
function surfaceArea(A) {
    const width = A.length;
    const length = A[0].length;

    const topAndBottom = width * length * 2;
    const verticalAreas = countDifferences(A, width, length);
  
    return topAndBottom + verticalAreas;
}

function countDifferences(A, width, length) {
    let diff = 0;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < length; j++) {

            const square = A[i][j];
            const neighbours = [
                A[i + 1] ? A[i + 1][j] : 0,
                A[i - 1] ? A[i - 1][j] : 0,
                A[i][j + 1] ? A[i][j + 1] : 0,
                A[i][j - 1] ? A[i][j - 1] : 0
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