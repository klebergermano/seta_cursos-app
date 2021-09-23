const {initializeApp} = require("firebase/app") 
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
const firebaseConfig = {
  apiKey: "AIzaSyCQ0IIED6S4yHGwd4iePApe3IDmrVW6-Cs",
  authDomain: "seta-cursos-app.firebaseapp.com",
  projectId: "seta-cursos-app",
  storageBucket: "seta-cursos-app.appspot.com",
  messagingSenderId: "604551662801",
  appId: "1:604551662801:web:617516e76e3f23ce35c9f0",
  measurementId: "G-MB10BFHBQ0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//---------------

import * as alunoContent from "./alunoContent.js";
import * as formAddAula from "./formAddAula.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAddCursos from "./formAddCurso.js";
import * as formAddAluno from "./formAddAluno.js";


async function insertSelectAlunos(){
 onSnapshot(
    collection(db, "aluno_historico"),
    (snap) => {
      let selectAluno = ``;
      snap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        selectAluno += `<option value='${doc.id}'>${doc.id} - ${
          doc.data().nome
        }</option>`;
      });
    document.querySelector("#main_select_aluno").innerHTML = selectAluno;
    })
}
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
