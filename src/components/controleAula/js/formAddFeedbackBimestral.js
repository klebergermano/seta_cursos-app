

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, setDoc,  doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import {insertElementHTML, btnCloseForm, defaultEventsAfterSubmitForm, showMessage} from "../../js_common/commonFunctions.js";
import * as formAddAula from "./formAddAula.js";

export function insertFormAddFeedbackBimestral(e){

    insertElementHTML('#page_content',
    './components/controleAula/formAddFeedbackBimestral.html', eventsFormAddFeedbackBimestral, e);
}

function eventsFormAddFeedbackBimestral(form, event){
 btnCloseForm("#form_add_feedback_bimestral");

      form.addEventListener("submit", (e) => {
        submitformAddFeedbackBimestral(e);  
      });

      formAddAula.insertOptionsInSelectAluno(form)
      formAddAula.insertOptionSelectCurso(form)
  insertOptionSelectBimestre(form, event)
}

async function insertOptionSelectBimestre(form, event){
    let bimestre = event.target.closest('.bimestres').dataset.bimestre;
    let feedbackValue = event.target.closest('.feedback_bimestral').querySelector(".feedback_value").textContent;
    let select = form.querySelector('#select_bimestre');
    console.log('f', form)
console.log('s', select)
    select.innerHTML = `<option value='${bimestre}' selected>${bimestre}</option>`
    console.log('f', form, 'e', event);

    form.querySelector('#bimestre_nome').innerHTML = select.options[select.selectedIndex].textContent;
form.querySelector('#observacao').value =  feedbackValue; 
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
    defaultEventsAfterSubmitForm("#form_add_feedback_bimestral", "Feedback adicionado com sucesso!");
    showMessage("form_add_feedback_bimestral", "Feedback adicionado com sucesso!")
  }).catch((error) => console.error("Erro ao adicionar feedback: ", error));

}
