
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, setDoc, doc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { removeBugExtraBgFormBLockScreen} from "../../jsCommon/commonFunctions.js";
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { insertAlunoNomeValue, insertCursoNomeValue } from "./formAddAula.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
export function insertFormAddFeedbackBimestral(e) {
  insertElementHTML('#page_content',
    './components/controleAula/formAddFeedbackBimestral.html', eventsFormAddFeedbackBimestral, e);
}

function eventsFormAddFeedbackBimestral(form, event) {
  removeBugExtraBgFormBLockScreen();
  btnCloseForm("#form_add_feedback_bimestral");
  form.addEventListener("submit", (e) => {
    submitformAddFeedbackBimestral(e);
  });
  insertAlunoNomeValue(form)
  insertCursoNomeValue(form)
  insertOptionSelectBimestre(form, event)
}

async function insertOptionSelectBimestre(form, event) {
  let bimestre = event.target.closest('.bimestres').dataset.bimestre;
  let feedbackValue = event.target.closest('.feedback_bimestral').querySelector(".feedback_value").textContent;
  let select = form.querySelector('#select_bimestre');
  select.innerHTML = `<option value='${bimestre}' selected>${bimestre}</option>`

  form.querySelector('#bimestre_nome').innerHTML = select.options[select.selectedIndex].textContent;
  form.querySelector('#observacao').value = feedbackValue;
}
function submitformAddFeedbackBimestral(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno.value;
  let curso = form.select_curso.value;
  let bimestre = form.select_bimestre.value;
  setDoc(doc(db, 'alunato', RA, 'cursos', curso),
    {
      bimestres: {
        [form.select_bimestre.value]: {
          ["feedback bimestral"]: {
            categoria: 'feedback bimestral',
            observacao: form.observacao.value
          }
        }
      }
    }, { merge: true }
  ).then(() => {
    defaultEventsAfterSubmitForm("#form_add_feedback_bimestral", "Feedback adicionado com sucesso!");
    //showMessage("form_add_feedback_bimestral", "Feedback adicionado com sucesso!")
  })
    .then(() => {
      addLogInfo('log_alunato', 'update', `feedback-${RA}-${curso}-${bimestre}`);
    })
    .catch((error) => {
      console.log(error);
      addLogInfo('log_alunato', 'error', `insert_feedback-${RA}-${curso}-${bimestre}`, error);
    });
}
