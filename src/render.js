//Funções Globais
const ImportHtml = require("./modules/#common/ImportHtml.js");
const ImportHtmlUsingNav = require("./modules/#common/ImportHtmlUsingNav.js");




//js módulos

//Load Homepage
ImportHtml("./components/controle_aula/index.html", "#app", "./modules/controle_aula/index.js");

//Carrega navegação do menu
ImportHtmlUsingNav("#nav_header", "#app");





