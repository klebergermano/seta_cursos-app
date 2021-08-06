import * as commonFunc from "../common/commonFunctions.js";

export function displayCursoById(idCurso) {
    commonFunc.hideAllElementsByClassName('.bg_curso');
    commonFunc.changeCSSDisplay("#" + idCurso, 'block');
  }
  
