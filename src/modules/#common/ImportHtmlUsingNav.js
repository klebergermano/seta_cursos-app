 //Dependecies
 const ImportHtml = require('./ImportHtml');
 //Importa o index.html de cada component dentro do folder "components". 
  //usa pra isso o atributo 'data-path' como nome de cada component.
  //'data-path' pode ser usado em qualquer elemento filho de um menu.
  function ImportHtmlUsingNav(navName, target){
    let childs = document.querySelector(navName).querySelectorAll('[data-path]');
    childs.forEach((item)=>{
      item.addEventListener('click', (e)=>{
        ImportHtml(`./components/${e.target.dataset.path}/index.html`, target);
      });
    });
  }

module.exports = ImportHtmlUsingNav;