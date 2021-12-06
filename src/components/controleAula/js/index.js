
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
//---------------

import * as alunoContent from "./alunoContent.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import {displaySpinnerLoad} from "../../js_common/commonFunctions.js";

async function insertSelectAlunos(){
 onSnapshot(
    collection(db, "alunato"),
    (snap) => {
      let selectAluno = ``;
      snap.forEach((doc) =>{
        // doc.data() is never undefined for query doc snapshots
        selectAluno += `<option value='${doc.id}'>${doc.id} - ${
          doc.data().aluno.nome
        }</option>`;
      });
    document.querySelector("#main_select_aluno").innerHTML = selectAluno;
    })
}

export function onload(){
  displaySpinnerLoad("#page_content")
  dbAlunoHistFunc.alunoHistCursosRealTimeDB("RA0009", alunoContent.insertAlunoContent);
  insertSelectAlunos();
  document.querySelector('#main_select_aluno').addEventListener('input', (e)=>{
    alunoContent.eventsAlunoContent();
  });
}

//----------------------------------------------------------
