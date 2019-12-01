//solution as submitted to Hackerrank:
function balancedSums(arr) {
    let before = 0;
    let afterArray = arr.slice(1);
    let after = afterArray.reduce((a, b) => a + b, 0);

    if (before === after) {
        return "YES";
    }

    for (let i = 1; i < arr.length; i++) {
        after -= arr[i];
        before += arr[i - 1];

        if (before === after) {
            return "YES";
        }
    }

    return "NO";
}

//input-output, so that the response appears on the page:
let C = [1, 2, 4, 0, 3];
//let C = [1];
response = balancedSums(C);
nodeToAppend = "d3";
display(response, nodeToAppend);