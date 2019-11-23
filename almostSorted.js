//solution as submitted to Hackerrank:
function almostSorted(arr) {
    let sorted = [...arr];

    function sortNumber(a, b) {
        return a - b;
    }
    sorted.sort(sortNumber);

    let differentAreasNumber = 0;
    let firstDifferent;
    let lastDifferent;

    for (let index = 0; index < arr.length; index++) {
        let item = arr[index];

        if (sorted[index] !== item) {

            if (sorted[index - 1] === arr[index - 1]) { // this is a new difference
                differentAreasNumber++;

                if (differentAreasNumber < 3) {
                    if (!firstDifferent || firstDifferent === 0) {
                        firstDifferent = index;
                    } else {
                        lastDifferent = index;
                    }
                } else {
                    console.log("no");
                    return "no";
                }
            } else { //this is continuing a streak of differences
                if (arr[index - 1] > item) {
                    lastDifferent = index;
                } else {
                    console.log("no");
                    return "no";
                }
            }
        }
    }

    console.log("yes");
    const toModify = (firstDifferent + 1) + " " + (lastDifferent + 1);

    if (lastDifferent - firstDifferent === 1 || differentAreasNumber > 1) {
        console.log("swap " + toModify);
        return "yes\nswap " + toModify;
    }

    console.log("reverse " + toModify);
    return "yes\nreverse " + toModify;
}

//input-output, so that the response appears on the page:
let B = [1, 5, 4, 3, 2, 6];
//let B = "4104 8529 49984 54956 63034 82534 84473 86411 92941 95929 108831 894947 125082 137123 137276 142534 149840 154703 174744 180537 207563 221088 223069 231982 249517 252211 255192 260283 261543 262406 270616 274600 274709 283838 289532 295589 310856 314991 322201 339198 343271 383392 385869 389367 403468 441925 444543 454300 455366 469896 478627 479055 484516 499114 512738 543943 552836 560153 578730 579688 591631 594436 606033 613146 621500 627475 631582 643754 658309 666435 667186 671190 674741 685292 702340 705383 722375 722776 726812 748441 790023 795574 797416 813164 813248 827778 839998 843708 851728 857147 860454 861956 864994 868755 116375 911042 912634 914500 920825 979477"
//    .split(" ")
//    .map(x => parseInt(x));

response = almostSorted(B);
nodeToAppend = "d2";
display(response, nodeToAppend);