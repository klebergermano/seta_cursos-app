import $ from "./$.js";

const fetchElement = (pathHTML) => {
  return fetch(pathHTML)
    .then((res) => res.text())
    .then(
      (htmlString) => new DOMParser().parseFromString(htmlString, "text/html").body.firstElementChild
    ).catch(err => console.log(err));
}

//------------------curriedAppendExternalElementHTML----------------------------------
async function appendExternalElementHTML(pathToFetchElementHTML) {
  const elementToAppend = await fetchElement(pathToFetchElementHTML);
  return (targetElementID) => {
    appendElementHTML(elementToAppend)($(targetElementID));
    return (callback) => {
      if (callback) callback();
    };
  };
}

export default appendExternalElementHTML;

/*
async function callCurriedAppendExternalElementHTML() { (await appendExternalElementHTML("header.html"))("page"); }
*/

//---------------------------------------------------------------------------------
//-----------------------------New Insert Element HTML ----------------------------
//---------------------------------------------------------------------------------

/* 
async function insertExternalElementHTML(
  pathToFetchElementHTML,
  targetElementID,
  callback,
) {
  try {
    const element = await fetchElement(pathToFetchElementHTML);
    const targetElement = document.getElementById(targetElementID);
    targetElement.appendChild(element);
    if (callback) callback();
  } catch (e) {
    console.log(e);
  }
}
*/

/* 
//refactored new function
async function appendExternalElementHTML(
  pathToFetchElementHTML,
  targetElementID,
  callback
) {
  try {
    const elementToAppend = await fetchElement(pathToFetchElementHTML);
    const targetElement = document.getElementById(targetElementID);

    targetElement.appendChild(elementToAppend);
    if (callback) callback();
  } catch (e) {
    console.log(e);
  }
}
*/

