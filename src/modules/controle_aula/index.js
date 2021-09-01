import * as alunoContent from "./alunoContent.js";

import * as formAddAula from "./formAddAula.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as formAddCursos from "./formAddCurso.js";
import * as formAddAluno from "./formAddAluno.js";
import * as commonFunc from "../common/commonFunctions.js";
import * as dragForms from "./dragForms.js";


function insertSelectAlunos() {
  db.collection("aluno_historico").onSnapshot((snap) => {
    let selectAluno = ``;
    snap.forEach((item) => {
      selectAluno += `<option value='${item.id}'>${item.id} - ${
        item.data().nome
      }</option>`;
    });
    document.querySelector("#main_select_aluno").innerHTML = selectAluno;
    //insere options do select no "select_aluno_add_aula"
    document.querySelector("#select_aluno_add_aula").innerHTML = selectAluno;
    //insere options do select no "select_aluno_add_curso"
  });
};


//TODO: Arrumar ordem de execução das funções
export function onload(){
 insertSelectAlunos();
 document.querySelector('#main_select_aluno').addEventListener('input', (e)=>{
   alunoContent.eventsAlunoContent();
 });

  //events FormAddAluno.js
  document.querySelector('#btn_add_aluno').addEventListener('click', (e)=>{
    formAddAluno.insertFormAddAlunoHTML();
  });

  dbAlunoHistFunc.alunoHistCursosRealTimeDB("RA01", alunoContent.insertAlunoContent);
  
  formAddAula.navAddFormsDisplayEvent();
  //FORMS
  formAddAula.eventFormsAdd();
  formAddAula.eventSelectAlunoAddAula();
  commonFunc.AddEventBtnCloseForm();

  //Carrega a lista de cursos do primeiro aluno quando inciado
  //no formulário form_add_aulas
  formAddAula.insertSelectCursosAddAula("RA01");
  
   

  
  //TODO: gerando erro ao carregar
  // formAddAluno.validaSelectOptionsAddAluno();
}


//----------------------------------------------------------
