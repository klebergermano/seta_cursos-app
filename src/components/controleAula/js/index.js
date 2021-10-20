
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
//---------------

import * as alunoContent from "./alunoContent.js";
import * as formAddAula from "./formAddAula.js";
import * as dbAlunoHistFunc from "../../js_common/dbAlunoHistoricoFunc.js";
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAddCursos from "./formAddCurso.js";
import * as formAddAluno from "./formAddAluno.js";


async function insertSelectAlunos(){
 onSnapshot(
    collection(db, "alunato"),
    (snap) => {
      let selectAluno = ``;
      snap.forEach((doc) => {
        console.log('doc:', doc.data());
        // doc.data() is never undefined for query doc snapshots
        selectAluno += `<option value='${doc.id}'>${doc.id} - ${
          doc.data().aluno.nome
        }</option>`;
      });
    document.querySelector("#main_select_aluno").innerHTML = selectAluno;
    })
}

//----------------------SPIN JS---------------------------------------

import {Spinner} from '../../../../node_modules/spin.js/spin.js';

var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 0.5, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#333333', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};




//--------------------------------------------------------------------


function displayLoad(){
var target = document.getElementById('page_content');
var spinner = new Spinner(opts).spin(target);

}

function removeLoad(){
  let spiner = document.querySelector('.spinner');
  document.querySelector('#page_content').removeChild(spiner);
}


export function onload(){
  displayLoad()
  dbAlunoHistFunc.alunoHistCursosRealTimeDB("RA01", alunoContent.insertAlunoContent);

  insertSelectAlunos();
  
  document.querySelector('#main_select_aluno').addEventListener('input', (e)=>{
    alunoContent.eventsAlunoContent();
  });



 
}

//----------------------------------------------------------
