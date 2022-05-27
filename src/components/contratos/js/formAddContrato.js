//Electron
const { ipcRenderer } = require("electron");
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc, getDocs, collection } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { displaySpinnerLoad, removeSpinnerLoad } from "../../jsCommon/spinnerJS.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
//Funções do componente
import inputComboCheckbox from "./inputComboCheckbox.js";
import insertComboTextarea from "./insertComboTextarea.js";
import insertCursoInfo from "./insertCursoInfo.js";
import insertInputDateValue from "./insertInputDateValue.js";
import removeAttributeFromElement from "./removeAttribute.js";
import insertInputValorTotal from "./insertInputValorTotal.js";
import setAttribute from "./setAttribute.js";
import { eventsIDContrato } from "./geradorIDContrato.js";
//---------------------------------------------------------------//
//Others libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//

export function insertFormAddContratoHTML() {
  insertElementHTML('#contratos_content',
    './components/contratos/formAddContrato.html', eventsFormAddContrato, null, true
  );
}


//Remove e reinsere o aluno usando css transition em ".aluno_off"
function checkboxRespAluno(e) {
  let btn_marcar_resp_aluno = document.querySelector("#btn_marcar_resp_aluno")
  let fieldset_aluno = document.querySelector("#fieldset_aluno");
  e.target.parentElement.classList.toggle("active");
  if (e.target.parentElement.classList.contains("active")) {
    btn_marcar_resp_aluno.classList.add('btn_ativo');
    btn_marcar_resp_aluno.querySelector('span').innerHTML = "Marcado como aluno(a) &#10003";
    fieldset_aluno.classList.add("aluno_off");
    //Insere o valor "IDEM" no nome do aluno
    setAttribute("#aluno_nome", 'style', "color: #fff");
    setAttribute("#aluno_nome", 'value', "IDEM");
    removeAttributeFromElement("#aluno_nome", 'required');
    removeAttributeFromElement("#aluno_parentesco", 'required');
    removeAttributeFromElement("#aluno_genero", 'required');
    removeAttributeFromElement("#aluno_rg", 'required');
  } else {
    btn_marcar_resp_aluno.classList.remove('btn_ativo');
    btn_marcar_resp_aluno.querySelector('span').textContent = "Marcar como aluno(a)";
    fieldset_aluno.classList.remove("aluno_off");
    //Remove o valor "IDEM" no nome do aluno
    setAttribute("#aluno_nome", 'style', "color:#333");
    setAttribute("#aluno_nome", 'value', "");
    setAttribute("#aluno_nome", 'required', true);
    setAttribute("#aluno_parentesco", 'required', true);
    setAttribute("#aluno_genero", 'required', true);
    setAttribute("#aluno_rg", 'required', true);

  }
}

function insertOptionsSelectCurso() {
  let optionsSelect = getDocs(collection(db, 'cursos_info'))
    .then((res) => {
      let options = '<option selected="true" disabled></option>';
      res.forEach((item) => {
        options += `<option class='color_${item.data().nome}' name='${item.id}' value='${item.data().nome}'>${item.data().nome}</option>`;
      })
      return options;
    }).then((res) => {
      document.querySelector("#curso_nome").innerHTML = res;
      document.querySelector("#combo_curso_2").innerHTML = res;
    }).catch((error) => {
      console.log(error);
    })
  return optionsSelect;
}

export function eventsFormAddContrato() {
  insertOptionsSelectCurso();
  //variáveis
  let form = document.querySelector("#form_add_contrato");
  let valor = document.querySelector("#curso_valor");
  let desconto = document.querySelector("#curso_desconto");
  let vencimento = document.querySelector("#curso_vencimento");

  //Listeners
  form.addEventListener("submit", (e) => {
    submitFormContrato(e)
  });

  //input Resp Aluno
  document
    .querySelector("#btn_marcar_resp_aluno")
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
  //vencimento.value = String(new Date().getDate()).padStart(2, "0");

  eventsIDContrato();

}


export function submitFormContrato(e) {
  e.preventDefault();
  let formInfo = createFormInfo(e);
 
  setDoc(doc(db, "contratos", formInfo.id_contrato),
    {
      resp_info: {
        nome: formInfo.resp_nome,
        genero: formInfo.resp_genero,
        end: formInfo.resp_end,
        end_numero: formInfo.resp_end_numero,
        bairro: formInfo.resp_bairro,
        cep: formInfo.resp_cep,
        cpf: formInfo.resp_cpf,
        rg: (formInfo.resp_rg).toUpperCase(),
        data_nasc: formInfo.resp_data_nasc,
        tel: formInfo.resp_tel,
        cel: formInfo.resp_cel,
        email: formInfo.resp_email,
      },
      aluno_info: {
        parentesco_resp: formInfo.aluno_parentesco,
        nome: formInfo.aluno_nome,
        genero: formInfo.aluno_genero,
        end: formInfo.aluno_end,
        end_numero: formInfo.aluno_end_numero,
        bairro: formInfo.aluno_bairro,
        cep: formInfo.aluno_cep,
        rg: (formInfo.aluno_rg).toUpperCase(),
        cel: formInfo.aluno_cel,
        tel: formInfo.aluno_tel,
        email: formInfo.aluno_email,
        data_nasc: formInfo.aluno_data_nasc,
      },
      curso_info: {
        cod: formInfo.curso_cod,
        nome: formInfo.curso_nome,
        modulos: formInfo.curso_modulos,
        duracao: formInfo.curso_duracao,
        parcelas: formInfo.curso_parcelas,
        carga_horaria: formInfo.curso_carga_horaria,
        horas_aula: formInfo.curso_horas_aula,
        vencimento: formInfo.curso_vencimento,
        valor_mes: formInfo.curso_valor,
        desconto_mes: formInfo.curso_desconto,
        valor_total_mes: formInfo.curso_valor_total,
        vencimento: formInfo.curso_vencimento,
        inicio: formInfo.curso_inicio,
        data_contrato: formInfo.curso_data_contrato,
        desconto_combo: formInfo.curso_combo,
        obs: formInfo.curso_obs
      },
      metadata: {
        id: formInfo.id_contrato,
        aluno_associado: "pendente",
        status: "ativo",
        created: new Date(),
        modified: new Date()
      }
    },
    { merge: true }
  ).then(() => {
    addLogInfo('log_contratos', 'insert', formInfo.id_contrato);
  })
    .then(() => {
      submitFormContratoPDF(e)
    })
    .catch((error) => {
      addLogInfo('log_contratos', 'error', formInfo.id_contrato, error);
    });

}

function createFormInfo(e) {
  const formData = [...e.target];
 

  let formInfo = {};
  let conclusao = new Date(e.target.curso_inicio.value);

  conclusao.setMonth(
    conclusao.getMonth() + parseInt(e.target.curso_duracao.value)
  );

  //Formata data
  let dia = String(conclusao.getDate() + 1).padStart(2, "0");
  let mes = String(conclusao.getMonth() + 1).padStart(2, "0");
  let ano = String(conclusao.getFullYear()).padStart(2, "0");
  let f_conclusao = ano + "-" + mes + "-" + dia;
  //Foreach que pega todos dos elementos inputs do submit e amazena em formInfo.
  formData.forEach((element) => {
    formInfo[`${element.id}`] = (element.value).trim();
  });
  //É necessário pegar o combo_textarea via selector por que ele não é um imput.
  let comboTextarea = document.querySelector("#combo_textarea");

  formInfo.curso_combo = (comboTextarea.innerHTML).trim();
  formInfo.curso_conclusao = (f_conclusao).trim();

  //Caso o Aluno seja o próprio responsável 
  if (e.target.checkbox_resp_aluno.checked) {
   
    formInfo.checkbox_resp_aluno = true;
    formInfo.aluno_nome = formInfo.resp_nome;
    formInfo.aluno_genero = formInfo.resp_genero;
    formInfo.aluno_end = formInfo.resp_end;
    formInfo.aluno_end_numero = formInfo.resp_end_numero;
    formInfo.aluno_parentesco = "IDEM";
    formInfo.aluno_bairro = formInfo.resp_bairro;
    formInfo.aluno_cep = formInfo.resp_cep;
    formInfo.aluno_rg = formInfo.resp_rg;
    formInfo.aluno_data_nasc = formInfo.resp_data_nasc;
    formInfo.aluno_email = formInfo.resp_email;
    formInfo.aluno_cel = formInfo.resp_cel;
    formInfo.aluno_tel = formInfo.resp_tel;
  } else {
    formInfo.checkbox_resp_aluno = false;
  }
  return formInfo;
}

//Envia o objeto com as informações do formulário para a main stream index.js
export function submitFormContratoPDF(e) {
  displaySpinnerLoad("#page_content", true);
  let formValues = createFormInfo(e);
  //  let loadinContrato = document.querySelector("#loading_contrato");
  let result = new Promise((resolve, reject) => {
    let res = ipcRenderer.invoke("submit", formValues);
    //loadinContrato.style.display = "block";
    if (res) {
      resolve(res);
    } else {
      reject();
    }
  });
  result.then(() => {
    //loadinContrato.style.display = "none";
    removeSpinnerLoad("#page_content");
    addLogInfo('log_contratos', 'create_pdf', formValues.resp_nome + ' - ' + formValues.curso_nome);

  }).catch((error) => {
    addLogInfo('log_contratos', 'error', formValues.resp_nome + ' - ' + formValues.curso_nome, error, error);
  });
}