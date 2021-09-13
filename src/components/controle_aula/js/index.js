import * as alunoContent from "./alunoContent.js";

import * as formAddAula from "./formAddAula.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../../js_common/commonFunctions.js";

import * as formAddCursos from "./formAddCurso.js";
import * as formAddAluno from "./formAddAluno.js";


function insertSelectAlunos() {
  db.collection("aluno_historico").onSnapshot((snap) => {
    let selectAluno = ``;
    snap.forEach((item) => {
      selectAluno += `<option value='${item.id}'>${item.id} - ${
        item.data().nome
      }</option>`;
    });
    document.querySelector("#main_select_aluno").innerHTML = selectAluno;
  });
};

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
  
}


//----------------------------------------------------------