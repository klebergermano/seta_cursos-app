import * as commonFunc from "../components/js_common/commonFunctions.js";
function importHTML(target, htmlSRC, scriptSRC){
    let element = document.querySelector(target);
    fetch(htmlSRC)
    .then((res)=> res.text())
    .then((html)=>{
      element.innerHTML = html;
      import(scriptSRC)
      .then((module)=>{
        module.onload();
      });
    })
  }

export function onload(){

  commonFunc.importHTMLWithScript('#page_content', "./components/home/index.html", "../home/js/index.js");


let childs = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");
childs.forEach((item) => {
  item.addEventListener("click", (e) => {
     let scriptSRC = '../components/'+ e.target.dataset.script_src + '/js/index.js'; 
    let htmlSRC = '../src/components/'+ e.target.dataset.path + '/index.html'; 
    importHTML('#page_content', htmlSRC, scriptSRC);
  });
});
}