const {setDoc,  doc} = require("firebase/firestore") 
import {db} from "../../js_common/variablesDB.js";

import * as formAddAula from "./formAddAula.js";
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";

import * as dateFunc from "../../js_common/dateFunc.js";

export function insertFormAddPontoExtra(){
    let form = commonFunc.insertElementHTML('#page_content',
    './components/controle_aula/formAddAula.html');
    form.then((form)=>{
      eventsFormAddPontoExtra(form)
    });
  }
  
function eventsFormAddPontoExtra(form){

  form.querySelector('.btn_close_form').addEventListener('click', (e) => {
    commonFunc.removeElementChild('#page_content', '#form_add_aula', () => {
      commonFunc.changeCSSDisplay('#block_screen', 'none')
    });
  })
  form.addEventListener("submit", (e) => {
    submitformAddPontoExtra(e);  
  });
  formAddAula.insertOptionsInSelectAluno(form)
  formAddAula.insertOptionSelectCurso(form).then((res)=>{
  })
  displayAlunoCursoNome(form)
  removeFiledFormAddAula(form)
}

function removeFiledFormAddAula(form){
  form.querySelector("h3").textContent = "Adicionar Ponto Extra";
  form.querySelector("#select_aula").removeAttribute("required");
  form.querySelector("#horario").removeAttribute("required");
  form.querySelector("#tema").removeAttribute("required");

  form.querySelector("#div_status_aula").style.display = "none";
  form.querySelector("#div_horario").style.display = "none";
  form.querySelector("#div_select_aula").style.display = "none";
  form.querySelector("#div_tema").style.display = "none";
}
function displayAlunoCursoNome(form){
  setTimeout(()=>{
    let selectAluno = form.querySelector('#select_aluno');
    let selectCurso = form.querySelector('#select_curso');
    let aluno = selectAluno.options[selectAluno.selectedIndex].innerHTML;
    let curso = selectCurso.options[selectCurso.selectedIndex].innerHTML;
  form.querySelector('#aluno_nome').innerHTML = '<span>Aluno: </span>'+aluno;
  form.querySelector('#curso_nome').innerHTML = '<span>Curso: </span>'+curso;
  }, 100)
}

function submitformAddPontoExtra(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let curso = form.select_curso.value;
  let pontoExtra = "ponto extra " + form.data.value;
  setDoc(doc(db, 'aluno_historico', RA, 'cursos', curso),
    {
      bimestres: {
        [form.select_bimestre.value]:{
            [pontoExtra]:{
            categoria: 'ponto extra',
            data: form.data.value,
            descricao: form.detalhes.value
            }
        }
      }
    }, { merge: true }
  )
  .then(() => {
  commonFunc.showMessage("form_add_aula", "Ponto Extra adicionado com sucesso!")
  setTimeout(() => {
    commonFunc.removeElementChild('#page_content', '#form_add_aula',()=>{
      commonFunc.changeCSSDisplay('#block_screen', 'none')
    });
  }, 1500);
  }).catch((error) => console.error("Erro ao adicionar Ponto Extra: ", error));

;
}
function submitformAddPontoExtraXXXXX(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let aulaHistorico;
 // let pontoExtra = "ponto extra #" +  Math.ceil(Math.random() * 1000000);;
  let pontoExtra = "ponto extra " + form.data.value;
  aulaHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .doc(form.select_curso.value)
    .set(
      {
        bimestres: {
          [form.select_bimestre.value]:{
              [pontoExtra]:{
               categoria: 'ponto extra',
               data: form.data.value,
               descricao: form.detalhes.value
              }
          }
        }
      },
      { merge: true }
    )
    .then(() =>
      commonFunc.showMessage("form_add_aula", "Ponto Extra adicionado com sucesso!")
    )
    .then(() => {
      setTimeout(() => {
        commonFunc.removeElementChild('#page_content', '#form_add_aula',()=>{
          commonFunc.changeCSSDisplay('#block_screen', 'none')
        });
      }, 1500);
    }).catch((error) => console.error("Error writing document: ", error));



}