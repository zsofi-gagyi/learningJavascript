function display(response, nodeToAppend) {
    var node = document.createTextNode(response);
    var element = document.getElementById(nodeToAppend);
    element.appendChild(node);
}