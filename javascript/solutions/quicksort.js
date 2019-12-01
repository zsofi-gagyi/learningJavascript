//partially tested at Hackerrank
function quickSort(array) {
    sort(array, 0, array.length - 1);
    return array;
}

function sort(array, firstIndex, lastIndex) {
    if (firstIndex >= lastIndex) {
        return array;
    }

    let pivot = array[Math.floor((firstIndex + lastIndex) / 2) + 1];
    let partitionIndex = partitionAndGetPartitionIndex(array, firstIndex, lastIndex, pivot);

    sort(array, firstIndex, partitionIndex - 1);
    sort(array, partitionIndex, lastIndex);
}

function partitionAndGetPartitionIndex(array, leftIndex, rightIndex, pivot) {

    while (leftIndex < rightIndex) {
        while (array[leftIndex] < pivot) {
            leftIndex++;
        }

        while (array[rightIndex] > pivot) {
            rightIndex--;
        }

        if (leftIndex < rightIndex) {
            swap(array, leftIndex, rightIndex);
        }
    }

    return leftIndex;
}

function swap(array, leftIndex, rightIndex) {
    const temp = array[leftIndex];
    array[leftIndex] = array[rightIndex];
    array[rightIndex] = temp;
}

//input-output, so that the response appears on the page:
//let solution10 = quickSort([45, 25, 46, 48, 28, 6, 13, 5, 36, 44, 7, 4, 11, 30, 24, 34, 15, 31, 38, 49]);
let solution10 = quickSort([0, -3, 6, 4, -10, 8, -5, 2, -7]);
//let solution10 = quickSort([3, 4, 2, 6, 1, 5]);
let nodeToAppend10 = "d10";
display(solution10, nodeToAppend10);