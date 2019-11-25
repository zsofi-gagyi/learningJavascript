//solution as submitted to Hackerrank:
function jimOrders(orders) {
    let indexStartingWithOne = 1;

    return orders.map(order => {
            return { time: (order[0] + order[1]), id: indexStartingWithOne++ }
        })
        .sort((a, b) => {
            return a.time - b.time || a.id - b.id;
        })
        .map(a => a.id);   
}

//input-output, so that the response appears on the page:
let solution7 = jimOrders([
    [8, 3],
    [5, 6],
    [6, 2],
    [2, 3],
    [4, 3]]
    );
let nodeToAppend7 = "d7";
display(solution7, nodeToAppend7);