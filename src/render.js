//Funções Globais
const { rmSync } = require("original-fs");
const ImportHtml = require("./modules/#common/ImportHtml.js");
const ImportHtmlUsingNav = require("./modules/#common/ImportHtmlUsingNav.js");

//Load Homepage
ImportHtml("./components/controle_aula/index.html", "#app");

//Carrega navegação do menu
ImportHtmlUsingNav("#nav_header", "#app");

//Firerbase
const alunoHistorico = db
  .collection("aluno_historico")
  .doc("RA01")
  .collection("cursos")
  .get();

alunoHistorico.then((data) => {

    let elemento = document.querySelector("#bg_cursos");
    let html;
    let aluno;
    let curso;

    data.forEach((res) => {
      res = res.data();
      html = '';
      elemento.insertAdjacentHTML("afterend", html);
    });

});

function appedHTML() {}
rmSync;
