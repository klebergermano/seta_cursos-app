

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAddAula from "./formAddAula.js";

export function insertFormAddFeedbackBimestral(e){

    commonFunc.insertElementHTML('#page_content',
    './components/controleAula/formAddFeedbackBimestral.html', eventsFormAddFeedbackBimestral, e);
}

function eventsFormAddFeedbackBimestral(form, event){
  commonFunc.btnCloseForm("form_add_feedback_bimestral");

      form.addEventListener("submit", (e) => {
        submitformAddFeedbackBimestral(e);  
      });

      formAddAula.insertOptionsInSelectAluno(form)
      formAddAula.insertOptionSelectCurso(form)
  commonFunc.changeCSSDisplay('#block_screen', 'block')
  insertOptionSelectBimestre(form, event)
}

async function insertOptionSelectBimestre(form, event){
    let bimestre = event.target.closest('.bimestres').dataset.bimestre;
    let feedbackValue = event.target.closest('.feedback_bimestral').querySelector(".feedback_value").textContent;
    let select = form.select_bimestre;
    select.innerHTML = `<option value='${bimestre}' selected>${bimestre}</option>`
    form.querySelector('#bimestre_nome').innerHTML = select.options[select.selectedIndex].textContent;
form.observacao.value =  feedbackValue; 
}
function submitformAddFeedbackBimestral(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let curso = form.select_curso.value;
  setDoc(doc(db, 'alunato', RA, 'cursos', curso), 
  {
    bimestres: {
      [form.select_bimestre.value]:{
          ["feedback bimestral"]:{
          categoria: 'feedback bimestral',
          observacao: form.observacao.value
          }
      }
    }
  },{ merge: true }
  ).then(() => {
    commonFunc.defaultEventsAfterSubmitForm("#form_add_feedback_bimestral", "Feedback adicionado com sucesso!");
    commonFunc.showMessage("form_add_feedback_bimestral", "Feedback adicionado com sucesso!")
  }).catch((error) => console.error("Erro ao adicionar feedback: ", error));

}
