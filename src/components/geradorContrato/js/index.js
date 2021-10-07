
const { ipcRenderer } = require("electron");
const VMasker = require("vanilla-masker");

import inputComboCheckbox from "./inputComboCheckbox.js";
import insertComboTextarea from "./insertComboTextarea.js";
import insertCursoInfo from "./insertCursoInfo.js";
import insertInputDateValue from "./insertInputDateValue.js";
import removeAttribute from "./removeAttribute.js";
import insertInputValorTotal from "./insertInputValorTotal.js";
import setAttribute from "./setAttribute.js";



function setCurso() {

let cursosSelect1 = document.querySelector("#curso_nome");
let cursosSelect2 = document.querySelector("#combo_curso_2");

  let cursos = cursosSelect1.innerHTML;
  cursosSelect2.innerHTML = cursos;
};

//Remove e reinsere o aluno usando css transition em ".aluno_off"
function checkboxRespAluno(e) {
let fieldset_aluno = document.querySelector("#fieldset_aluno");
  e.target.parentElement.classList.toggle("active");
  if (e.target.parentElement.classList.contains("active")) {
    fieldset_aluno.classList.add("aluno_off");
    //Insere o valor "IDEM" no nome do aluno
    setAttribute("#aluno_nome", 'style', "color: #fff");
    setAttribute("#aluno_nome", 'value', "IDEM");
    removeAttribute("#aluno_nome", 'required');
  } else {
    fieldset_aluno.classList.remove("aluno_off");
    //Remove o valor "IDEM" no nome do aluno
    setAttribute("#aluno_nome", 'style', "color:#333");
    setAttribute("#aluno_nome", 'value', "");
    setAttribute("#aluno_nome", 'required', true);
  }
}
//Envia o objeto com as informações do formulário para a main stream index.js
function sendForm(e) {
  let comboTextarea = document.querySelector("#combo_textarea");

let loadinContrato = document.querySelector("#loading_contrato");

  e.preventDefault();
  let conclusao = new Date(e.target.curso_inicio.value);
  conclusao.setMonth(
    conclusao.getMonth() + parseInt(e.target.curso_duracao.value)
  );
  let dia = String(conclusao.getDate() + 1).padStart(2, "0");
  let mes = String(conclusao.getMonth() + 1).padStart(2, "0");
  let ano = String(conclusao.getFullYear()).padStart(2, "0");
  let f_conclusao = ano + "-" + mes + "-" + dia;

  const formData = [...e.target];
  let formValues = {};
  formData.forEach((element) => {
    formValues[`${element.id}`] = element.value;
  });

  formValues.curso_combo = comboTextarea.innerHTML;
  formValues.curso_conclusao = f_conclusao;

  if (e.target.checkbox_resp_aluno.checked) {

    formValues.aluno_nome = "IDEM";
    formValues.aluno_end = "--//--";
    formValues.aluno_numero = "--//--";
    formValues.aluno_parentesco = "--//--";
    formValues.aluno_bairro = "--//--";
    formValues.aluno_cep = "--//--";
    formValues.aluno_rg = "--//--";
    formValues.aluno_cel = "--//--";
    formValues.aluno_tel = "--//--";
  }
  let result = new Promise((resolve, reject) => {
    let res = ipcRenderer.invoke("submit", formValues);

    loadinContrato.style.display = "block";
    if (res) {
      resolve(res);
    } else {
      reject();
    }
  });
  result.then(() => {
    loadinContrato.style.display = "none";
  });
}

export function onload(){
  setCurso() 

//variáveis
let form = document.querySelector("#form_contrato");
let valor = document.querySelector("#curso_valor");
let desconto = document.querySelector("#curso_desconto");
let vencimento = document.querySelector("#curso_vencimento");



//Listeners
form.addEventListener("submit", sendForm);

//input Resp Aluno
document
  .querySelector("#label_checkbox_resp_aluno")
  .addEventListener("input", checkboxRespAluno);

//Button Checkbox Combo
document
  .querySelector("#label_check_combo")
  .addEventListener("input", inputComboCheckbox);

//Listener no nome do curso
document
  .querySelector("#curso_nome")
  .addEventListener("change", insertCursoInfo);

document
  .querySelector("#combo_curso_2")
  .addEventListener("input", insertComboTextarea);

valor.addEventListener("input", insertInputValorTotal);
desconto.addEventListener("input", insertInputValorTotal);
desconto.addEventListener("change", insertComboTextarea);

//Mascaras
VMasker(valor).maskMoney();
VMasker(desconto).maskMoney();
VMasker(document.querySelector("#resp_cep")).maskPattern("99999-999");
VMasker(document.querySelector("#resp_cpf")).maskPattern("999.999.999-99");
VMasker(document.querySelector("#resp_rg")).maskPattern("99.999.999-S");
VMasker(document.querySelector("#aluno_rg")).maskPattern("99.999.999-S");
VMasker(document.querySelector("#aluno_cep")).maskPattern("99999-999");

//Insere a data corrente do dia como possível data do contrato.
insertInputDateValue(new Date(), "#curso_data_contrato");
//Insere a data corrente do dia como possível inicio do curso.
insertInputDateValue(new Date(), "#curso_inicio");
//Insere a dia atual como como possível dia de vencimento do curso.
vencimento.value = String(new Date().getDate()).padStart(2, "0");
    
}