
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getFirestore, onSnapshot, collection, getDocs } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { eventsAulas } from "./eventsAula.js";
import { insertNavCursosInBGCursos } from "./navCursosAluno.js";
import { createAlunoContentHTML } from "./createAlunoContentHTML.js";
//---------------------------------------------------------------//

export function getAlunoCursosDB(RA) {
  let alunoHistorico = getDocs(collection(db, 'alunato', RA, 'cursos'));
  if (alunoHistorico === 'undefined') {
    alunoHistorico = []
  }
  return alunoHistorico;
}
export function getSnapshotAlunoCursosDB(RA, callback) {
  onSnapshot(
    collection(db, 'alunato', RA, 'cursos'),
    (snapshot) => {
      callback(RA, snapshot.docChanges());
    });
}
export function getCursosDB(RA, callback) {
  onSnapshot(
    collection(db, 'alunato', RA, 'cursos'),
    (snapshot) => {
      callback(RA, snapshot.docChanges());
    });
}

export function contentAlunoRealTime() {
  let RA = getRAFromMainSelectAluno();
  getSnapshotAlunoCursosDB(RA, insertAlunoContent);
}

function getRAFromMainSelectAluno() {
  let mainSelect = document.querySelector('#main_select_aluno');
  let RA = mainSelect.options[mainSelect.selectedIndex].value;
  return RA;
}
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

export function insertAlunoContent(RA, alunoCursosDB) {
  document.querySelector("#controle_aula_content").style.opacity = '0';
  if (alunoCursosDB.length !== 0) {
    createAlunoContentHTML(alunoCursosDB, RA);
    let nomeCurso = alunoCursosDB[0].doc.data().curso_info.nome;
    insertNavCursosInBGCursos(RA, nomeCurso);
  } else {
    document.querySelector("#controle_aula_content").innerHTML = alunoSemCursoContent();
  }
  let spiner = document.querySelector('.spinner');
  if (spiner) {
    document.querySelector('#page_content').removeChild(spiner);
  }
  document.querySelector("#controle_aula_content").style.opacity = '1';
  eventsAulas();
}
//======================================================================================
//---------------------------------CREATE HTML -----------------------------------------
//======================================================================================
function alunoSemCursoContent() {
  let content = `
  <div class='bg_curso' style='display:block; padding-top:30px;'>
  <h3 class='title_curso_nome'>Aluno sem curso associado</h3>
  </div>
  `
  return content
}


