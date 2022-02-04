//Funções do Component
import insertComboTextarea from "./insertComboTextarea.js";
import setAttribute from "./setAttribute.js";
import removeAttributeFromElement from "./removeAttribute.js";
//---------------------------------------------------------------//

function inputComboCheckbox(e) {
  let btn_check_combo = document.querySelector('#label_check_combo');
  let checkCombo = document.querySelector("#check_combo");
  if (!e.target.checked) {
    btn_check_combo.querySelector('span').innerHTML = "+ Desconto Combo";
    checkCombo.value = false;
    e.target.parentElement.classList.remove("check_combo_checked");
  } else {
    btn_check_combo.querySelector('span').innerHTML = "Desconto Combo &#10003;";
    checkCombo.value = true;
    e.target.parentElement.classList.add("check_combo_checked");
  }
  comboTextarea(e);
}

function comboTextarea(e) {
  let comboCurso1 = document.querySelector("#combo_curso_1");
  let comboCurso2 = document.querySelector("#combo_curso_2");
  let combo_textarea = document.querySelector("#combo_textarea");
  combo_textarea.style.zIndex = "0";

  if (e.target.checked) {
    combo_textarea.style.zIndex = "0";
    combo_textarea.classList.remove("display_off");

    comboCurso1.style.color = "#444";
    comboCurso2.style.color = "#444";
    comboCurso2.style["pointer-events"] = "auto";
    setAttribute('#combo_curso_2', 'required', true);
    insertComboTextarea();
    removeAttributeFromElement('#combo_curso_2', 'disabled');

  } else {
    combo_textarea.style.zIndex = "1";
    combo_textarea.classList.add("display_off");

    comboCurso1.style.color = "transparent";
    comboCurso2.style.color = "transparent";
    comboCurso2.style["pointer-events"] = "none";
    removeAttributeFromElement('#combo_curso_2', 'required');
    setAttribute("#combo_curso_2", "disabled", true);
  }
}

export default inputComboCheckbox;