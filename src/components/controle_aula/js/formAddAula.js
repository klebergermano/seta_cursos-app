const {setDoc, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
import {db} from "../../js_common/variablesDB.js";

import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as formAddAluno from "./formAddAluno.js";
import * as formEditAulas from "./formEditAula.js";

export async function insertFormAddAulaHTML() {
  commonFunc.insertElementHTML('#page_content',
    './components/controle_aula/formAddAula.html', eventsFormAddAula);
}
 export function eventsFormAddAula(form) {
  form.querySelector('.btn_close_form').addEventListener('click', (e) => {
    commonFunc.removeElementChild('#page_content', '#form_add_aula', () => {
      commonFunc.changeCSSDisplay('#block_screen', 'none')
    });
  })
  form.addEventListener("submit", (e) => {
    submitFormAddAula(e);  
  });
  //Bloqueia o fundo com o "#block_screen".
  commonFunc.changeCSSDisplay('#block_screen', 'block')
  //Copia as opções do "#main_select_aluno" e insere no select_aluno
  insertOptionsInSelectAluno(form)
  //insere as opções de curso e seta o selecionado.
  insertOptionSelectCurso(form)
  form.querySelector('#select_bimestre').addEventListener('change', (e) => {
    form.querySelector('#select_aula').removeAttribute('disabled');
    validaSelectAula(form)
  });
  eventClickBtnStatus(form)
  setInputsProva(form)
}

function eventClickBtnStatus(form){
  let btns = form.querySelector('#div_status_aula').querySelectorAll('label');;
  btns.forEach((item)=>{
    item.addEventListener('click', ()=>{
    setClassBtnStatus(form)
    });
  });
}

function setInputsProva(form){
let selectAula = form.querySelector("#select_aula");
let selectCategoria = form.querySelector("#select_categoria");

selectAula.addEventListener('change', (e)=>{
  if(e.target.value === "aula 16"){
    form.querySelector("#bg_prova_inputs").style.display = "flex";
    form.querySelector("#div_detalhes").style.display = "none";
    form.querySelector("#nota_prova").setAttribute("required", true);
    form.querySelector("#numero_questoes").setAttribute("required", true);
    form.querySelector("#obs_prova").setAttribute("required", true);
    form.querySelector("#detalhes").removeAttribute("required");
    selectCategoria.selectedIndex = 3;

  }else{
    selectCategoria.selectedIndex = 0;
    form.querySelector("#div_detalhes").style.display = "flex";
    form.querySelector("#bg_prova_inputs").style.display = "none";
    form.querySelector("#nota_prova").removeAttribute("required");
    form.querySelector("#numero_questoes").removeAttribute("required");
    form.querySelector("#obs_prova").removeAttribute("required");
    form.querySelector("#detalhes").setAttribute("required", true);
  }
})
}



export function setClassBtnStatus(form){
  removeClassActivedBtnStatus();
  let btns = form.querySelector('#div_status_aula').querySelectorAll('label');
  btns.forEach((item)=>{
    if(item.querySelector('input').checked === true){
      item.classList.add('actived_'+item.id);
      let tema = form.querySelector("#tema");
      let detalhes = form.querySelector("#detalhes");
      if(item.querySelector('input').value !== 'concluida'){
        tema.setAttribute('disabled', true); tema.value = "";
       detalhes.setAttribute('disabled', true); detalhes.value = "";
      }else{
        tema.removeAttribute('disabled');
        detalhes.removeAttribute('disabled');
      }
      }
  });
}

function removeClassActivedBtnStatus(){
  let btns = document.querySelectorAll('label');
  btns.forEach((item)=>{
      item.className = '';
  });
}

export function insertOptionsInSelectAluno(form) {
  let select = form.querySelector('#select_aluno');
  let mainSelect = document.querySelector('#main_select_aluno');
  select.innerHTML = mainSelect.innerHTML;
  select.selectedIndex = mainSelect.selectedIndex;
  select.setAttribute('disabled', true);
 form.querySelector('#aluno_nome').innerHTML = '<span>Aluno: </span>'+  select.options[select.selectedIndex].textContent;
}

export  async function insertOptionSelectCurso(form){
  let select = form.querySelector('#select_curso');
  let option = ``;
let bg_curso = document.querySelectorAll(".bg_curso");
let navCursos = document.querySelector('.nav_cursos_aluno');
let activeCurso = navCursos.querySelector('.active').dataset.active;
bg_curso.forEach((curso)=>{
    if (commonFunc.stringToID(curso.dataset.curso) === activeCurso) {
     select.innerHTML = `<option value='${curso.dataset.curso}' selected>${curso.dataset.curso}</option>`
    }
})
  form.querySelector('#curso_nome').innerHTML = '<span>Curso: </span>'+select.options[select.selectedIndex].textContent;
}



function validaSelectAula(form) {
  let infoAula;
  infoAula = getInfoFormAddAula(form);
  blockSelectOptionsAddAulas(infoAula.RA, infoAula.curso, infoAula.bimestre);
}

function getInfoFormAddAula(form) {
  let infoAddAula = {};
  let selectAluno = form.querySelector("#select_aluno");

  let RA = selectAluno.options[selectAluno.selectedIndex].value;

  let selectCurso = form.querySelector("#select_curso");
  let curso = selectCurso.options[
    selectCurso.selectedIndex
  ].value;

  let selectBimestre = form.querySelector("#select_bimestre");
  let bimestre = selectBimestre.options[
    selectBimestre.selectedIndex
  ].value;

  infoAddAula.RA = RA;
  infoAddAula.curso = curso;
  infoAddAula.bimestre = bimestre;
  return infoAddAula;
}
function blockSelectOptionsAddAulas(RA, curso, bimestre) {
  //Bloqueia as options do select #aula_numero no formulário form_add_aula
  let select = document.querySelector("#select_aula");
  let aulasKeys = getKeysAulas(RA, curso, bimestre);
  aulasKeys.then((res) => {
    //if evita o primeira execução do código desnecessária caso o array seja vazio.
    if (res) {
      //options[i] são as options do select
      for (let i = 0; i <= select.options.length - 1; i++) {
        //remove o attributo disable setado anteriormente
        if (select.options[i].value !== "") {
          select.options[i].removeAttribute("disabled");
        }
        //res[j] são as aulas ja feitas
        for (let j = 0; j <= res.length; j++) {
          if (res[j] === select.options[i].value) {
            select.options[i].setAttribute("disabled", "true");
          }
        }
      }
    }
  });
}

function blocoAddAula(dados) {
  let aula = {};
  if( dados.select_categoria.value === "prova"){
    aula = {
      [dados.select_bimestre.value]: {
        [dados.select_aula.value]: {
          categoria: dados.select_categoria.value,
          status: dados.status.value,
          tema: dados.tema.value,
          data: dados.data.value,
          horario: dados.horario.value,
          nota: dados.nota_prova.value,
          numero_questoes: dados.numero_questoes.value,
          observacao: dados.obs_prova.value,
        },
      },
    };
  }else{
    aula = {
      [dados.select_bimestre.value]: {
        [dados.select_aula.value]: {
          categoria: dados.select_categoria.value,
          status: dados.status.value,
          tema: dados.tema.value,
          data: dados.data.value,
          horario: dados.horario.value,
          detalhes: dados.detalhes.value,
        },
      },
    };
  }

  return aula;
}

function getKeysAulas(RA, idCurso, bimestre) {
  let aluno = dbAlunoHistFunc.getAlunoHistCursosDB(RA);
  let keysAulas = [];
  let nomeCursoBD;
  let keys = aluno.then((res) => {
    res.forEach((e) => {
      //nomeCursoBD = commonFunc.stringToID(e.data().curso);
      if (e.data().curso === idCurso) {
        if (e.data().bimestres[bimestre]) {
          keysAulas = Object.keys(e.data().bimestres[bimestre]);
        }
      }
    });
  }).then(() => {
    return keysAulas;
  }).catch((err) => { console.log(err) });
  return keys;
}

function submitFormAddAula(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let curso =  form.select_curso.value;
  setDoc(doc(db, 'aluno_historico', RA, 'cursos', curso),
        {bimestres: blocoAddAula(form)},
        { merge: true }
  )
.then(()=>{
  commonFunc.showMessage("form_add_aula", "Aula adicionada com sucesso!")
  setTimeout(() => {
    commonFunc.removeElementChild('#page_content', '#form_add_aula',()=>{
      commonFunc.changeCSSDisplay('#block_screen', 'none')
    });
  }, 1500);
}).catch((error) => console.error("Erro ao adicionar aula:", error));
}

