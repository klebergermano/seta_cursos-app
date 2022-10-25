//Errors
import CustomError from "../errors/CustomError.js";
//Helpers
import $ from "./$.js";
//---------------------------------------------------------------------//
const fetchElementHTML = async (pathHTML) => {
  return fetch(pathHTML)
    .then((res) => res.text())
    .then(
      (htmlString) => new DOMParser().parseFromString(htmlString, "text/html").body.firstElementChild
    ).catch(err => console.log(err)
  );
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
  }catch(e){ 
   console.log(new CustomError({customInfo:'O elemento não pode ser adicionado', error: e}))
  }

}



//------------------------------------------------------------------------------//

// Curried function to aappend a element HTML
async function F_appendFetchedElHTML(pathToFetchElementHTML) {
const a = new Promise(async (resolve, reject)=>{
const elementToAppend = await fetchElementHTML(pathToFetchElementHTML);
  if(elementToAppend) resolve(); 
  else reject(); 

  })
 
}



export default appendFetchedElHTML;
