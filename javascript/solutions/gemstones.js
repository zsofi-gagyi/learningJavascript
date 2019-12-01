//solution as submitted to Hackerrank:
function gemstones(arr) {
    let shortest = arr.reduce((a, b) => { return a.length < b.length ? a : b });

    let dictionary = {};
    for (const char of shortest) {
        if (!dictionary[char]) {
            dictionary[char] = true;
        }
    }

    let commonLetters = 0;
    Object.keys(dictionary).forEach(char => {
        const stringsNotContainingIt = arr.filter(string => !string.includes(char));
        if (stringsNotContainingIt.length === 0) {
            commonLetters++;
        }
    });

    return commonLetters;
}

//input-output, so that the response appears on the page:
let solution3 = gemstones(["abcde", "bxa", "adbkctde", "adbkctdevvvv"]);
let nodeToAppend3 = "d5";
display(solution3, nodeToAppend3);