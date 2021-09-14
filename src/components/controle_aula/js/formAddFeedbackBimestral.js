import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAddAula from "./formAddAula.js";

export function insertFormAddFeedbackBimestral(e){

    commonFunc.insertElementHTML('#page_content',
    './components/controle_aula/formAddFeedbackBimestral.html', eventsFormAddFeedbackBimestral, e);
}

function eventsFormAddFeedbackBimestral(form, event){

    form.querySelector('.btn_close_form').addEventListener('click', (e) => {
        commonFunc.removeElementChild('#page_content', '#form_add_feedback_bimestral', () => {
          commonFunc.changeCSSDisplay('#block_screen', 'none')
        });
      })

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
    let aulaHistorico;
   // let pontoExtra = "ponto extra #" +  Math.ceil(Math.random() * 1000000);;
  
    aulaHistorico = db
      .collection("aluno_historico")
      .doc(RA)
      .collection("cursos")
      .doc(form.select_curso.value)
      .set(
        {
          bimestres: {
            [form.select_bimestre.value]:{
                ["feedback bimestral"]:{
                 categoria: 'feedback bimestral',
                 observacao: form.observacao.value
                }
            }
          }
        },
        { merge: true }
      )
      .then(() =>
        commonFunc.showMessage("form_add_feedback_bimestral", "Feedback adicionado com sucesso!")
      )
      .then(() => {
        setTimeout(() => {
          commonFunc.removeElementChild('#page_content', '#form_add_feedback_bimestral',()=>{
            commonFunc.changeCSSDisplay('#block_screen', 'none')
          });
        }, 1500);
      }).catch((error) => console.error("Error writing document: ", error));
  
  
  
  }