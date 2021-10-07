function setAttribute(inputName, attributeName, attributeValue ){
    let input = document.querySelector(inputName);
    input.setAttribute(attributeName, attributeValue);
}
export default setAttribute;