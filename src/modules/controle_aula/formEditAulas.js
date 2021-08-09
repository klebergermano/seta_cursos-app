

import * as commonFunc from "../common/commonFunctions.js";
//TODO:-----------------------------EDIT Aulas------------------------------------
export function showEditAula(e) {
    let addForm = document.querySelector("#form_add_aula");
    let savePreviousHTMLForm = addForm.innerHTML;
    addForm.classList.add("edit_form");
    commonFunc.changeCSSDisplay("#form_add_aula", "block");
    commonFunc.changeCSSDisplay("#block_screen", "block");
    let select = addForm.querySelectorAll("select");
    select.forEach((item) => {
      item.setAttribute("disabled", true);
    });
  }
  