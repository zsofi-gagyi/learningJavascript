//solution as submitted to Hackerrank:
function icecreamParlor(m, arr) {
    let sparseArrayOfPrices = [];

    for (let priceIndex in arr) {
        let price = arr[priceIndex];
        priceIndex = parseInt(priceIndex);

        let complementerPrice = m - price;

        if (sparseArrayOfPrices[complementerPrice] !== undefined) {
            const anotherPriceIndex = sparseArrayOfPrices[complementerPrice];

            return [(anotherPriceIndex + 1), (priceIndex + 1)];
        }

        sparseArrayOfPrices[price] = priceIndex;
    }

    return "impossible";
}

//input-output, so that the response appears on the page:
let solution9 = icecreamParlor(5, [1, 4, 5, 3, 2]);
//let solution9 = icecreamParlor(3, [1, 2]);
let nodeToAppend9 = "d9";
display(solution9, nodeToAppend9);