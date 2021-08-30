//Funções Globais
//const ImportHtml = require("./modules/common/ImportHtml.js");
//const ImportHtmlUsingNav = require("./modules/common/ImportHtmlUsingNav.js");





//js módulos

//Load Homepage
//ImportHtml("./components/controle_aula/index.html", "#content_page", "./modules/controle_aula/index.js");

//Carrega navegação do menu
//ImportHtmlUsingNav("#main_menu_lateral", "#content_page");

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


    let childs = document.querySelector('#main_menu_lateral').querySelectorAll("a");
    childs.forEach((item) => {
      item.addEventListener("click", (e) => {
         let scriptSRC = './modules/'+ e.target.dataset.script_src + '/index.js'; 
        let htmlSRC = './components/'+ e.target.dataset.path + '/index.html'; 
        importHTML('#page_content', htmlSRC, scriptSRC);
      });
    });

//Carrega a primeira página
importHTML('#page_content', './components/controle_aula/index.html',"./modules/controle_aula/index.js" )

