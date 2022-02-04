//Electron
const { ipcRenderer } = require("electron");
//---------------------------------------------------------------//
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { displaySpinnerLoad, removeSpinnerLoad } from "../../jsCommon/commonFunctions.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//

export function eventsBaixarHistorico(e) {
  let mainSelectAluno = document.querySelector('#main_select_aluno');
  let bgCurso = e.target.closest('.bg_curso');
  let alunoNome = mainSelectAluno.options[mainSelectAluno.selectedIndex].textContent;
  let curso = bgCurso.dataset.curso;
  let alunoInfo = {};
  alunoInfo.RA = mainSelectAluno.value;
  alunoInfo.curso = curso;
  alunoInfo.nome = alunoNome;
  sendHistoricoAluno(alunoInfo)
}

//Envia o objeto com as informações do formulário para a main stream index.js
async function sendHistoricoAluno(alunoInfo) {
  displaySpinnerLoad("#page_content", true);
  let docAlunoHistorico = getDoc(doc(db, "alunato", alunoInfo.RA, 'cursos', alunoInfo.curso));
  docAlunoHistorico.then((resData) => {
    let res = resData.data();
    res.RA = alunoInfo.RA;
    res.curso = alunoInfo.curso;
    res.nome = alunoInfo.nome;
    return res;
  }).then((res) => {
    ipcRenderer.invoke("baixarHistoricoAluno", res)

  }).then(() => {
    //TODO: retirar setTimeout.
    //Response esta sendo executado antes da mensagem de conclusão aparecer
    //setTimeout esta servindo para fazer um delay na remoção do spinner
    setTimeout(() => {
      removeSpinnerLoad("#page_content");
    }, 1500)
  }).then(() => {
    addLogInfo("log_alunato", "create_pdf", `histórico_pdf-${alunoInfo.RA}-${alunoInfo.curso}`);
  })
    .catch((error) => {
      addLogInfo("log_alunato", "error", `histórico_pdf-${alunoInfo.RA}-${alunoInfo.curso}`, error);
      console.log('Ocorreu um erro ao enviar o Histórico do Aluno', err)
    });
}//-------------//rs
