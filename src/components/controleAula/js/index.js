//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, collection, getDocs } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { displaySpinnerLoad } from "../../jsCommon/spinnerJS.js";
import { insertAlunoContent, getSnapshotAlunoCursosDB } from "./inserAlunoContent.js";
import { insertFormAddAulaGrupoHTML } from "./formAddAulaGrupo.js";
//---------------------------------------------------------------//
async function insertOptionsSelectAlunos() {
  let lastRA = getDocs(collection(db, "alunato"))
    .then((snap) => {
      let arrRAList = [];
      let selectAluno = ``;
      snap.forEach((doc) => {
        arrRAList.push(doc.id);
        selectAluno += `<option  value='${doc.id}'>${doc.id} - ${doc.data().aluno.nome}</option>`;
      });
      document.querySelector("#main_select_aluno").innerHTML = selectAluno;
      return arrRAList;
    }).then((arrRAList) => {
      let lastRA = (arrRAList.sort())[arrRAList.length - 1];
      setLastRAOptionSelected(lastRA)
      return lastRA;
    })
  return lastRA;
}

function setLastRAOptionSelected(lastRA) {
  let mainsSelectOption = document.querySelectorAll("#main_select_aluno option");
  let options = Array.from(mainsSelectOption);
  options.forEach((item) => {
    if (item.value === lastRA) {
      item.setAttribute('selected', true);
    }
  });
}

export async function onload() {
  displaySpinnerLoad("#page_content")
  insertOptionsSelectAlunos()
    .then((RA) => {
      getSnapshotAlunoCursosDB(RA, insertAlunoContent)
    });
  document.querySelector('#main_select_aluno').addEventListener('change', (e) => {

    let RA = e.target.value;
    getSnapshotAlunoCursosDB(RA, insertAlunoContent)

  });

  document.querySelector("#btn_add_aula_grupo").addEventListener('click', (e) => {
    insertFormAddAulaGrupoHTML();
  })
}
