
const { ipcRenderer } = require("electron");
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 

const db = getFirestore(firebaseApp);

export function eventsBaixarHistorico(e){
  let mainSelectAluno = document.querySelector('#main_select_aluno');
  let bgCurso = e.target.closest('.bg_curso');
  let alunoNome = mainSelectAluno.options[mainSelectAluno.selectedIndex].textContent;
  console.log(alunoNome);
  let curso = bgCurso.dataset.curso;
  let alunoInfo = {}; 
    alunoInfo.RA = mainSelectAluno.value;
    alunoInfo.curso = curso;
    alunoInfo.nome = alunoNome;
    sendHistoricoAluno(alunoInfo)
}

//Envia o objeto com as informações do formulário para a main stream index.js
function sendHistoricoAluno(alunoInfo) {
  
    let docAlunoHistorico = getDoc(doc(db, "aluno_historico",  alunoInfo.RA, 'cursos', alunoInfo.curso));
    docAlunoHistorico.then((resData)=>{
        let res = resData.data();
        res.RA = alunoInfo.RA;
        res.curso = alunoInfo.curso;
        res.nome = alunoInfo.nome;
        return res;
    }).then((res)=>{
        ipcRenderer.invoke("baixarHistoricoAluno", res);
        //teste(res)
    });




  }//-------------//