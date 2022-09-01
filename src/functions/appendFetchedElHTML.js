import $ from "./$.js";

const fetchElementHTML = (pathHTML) => {
  return fetch(pathHTML)
    .then((res) => res.text())
    .then(
      (htmlString) => new DOMParser().parseFromString(htmlString, "text/html").body.firstElementChild
    ).catch(err => console.log(err));
}
const appendElementHTML = (element) => (target) => target.appendChild(element);

// Curried function to aappend a element HTML
async function appendFetchedElHTML(pathToFetchElementHTML) {
  try{
    const elementToAppend = await fetchElementHTML(pathToFetchElementHTML);
    return (targetElementID) => {
      appendElementHTML(elementToAppend)($(targetElementID));
      return (callback) => { if (callback) callback(); };
    };
  }catch(e){ console.log(e)}

}

export default appendFetchedElHTML;
