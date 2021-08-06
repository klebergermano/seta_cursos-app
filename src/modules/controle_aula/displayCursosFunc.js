import * as commonFunc from "../common/commonFunctions.js";

export function displayCursoById(idCurso) {
    commonFunc.hideAllElementsByClassName('.bg_curso');
    commonFunc.changeCSSDisplay("#" + idCurso, 'block');
  }
  
  export function displayFirstCursoOfNavCursos() {
    //adiciona class "active" no primeiro elemento do navCursos
    let navCursos = document
      .querySelector(".nav_cursos")
      .getElementsByTagName("a")[0];
    navCursos.classList.add("active");
    //mostra o primeiro curso do menu navCursos
    displayCursoById(navCursos.dataset.active);
  }