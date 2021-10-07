
const { ipcRenderer } = require("electron");
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 

const db = getFirestore(firebaseApp);

export function eventsBaixarHistorico(){
    sendHistoricoAluno()
}

//Envia o objeto com as informações do formulário para a main stream index.js
function sendHistoricoAluno() {
    let alunoInfo = {}; 
    alunoInfo.RA = 'RA01';
    alunoInfo.curso = 'Excel Avançado';
    alunoInfo.nome = 'Fulanilson de Tal da Silva';

    let docAlunoHistorico = getDoc(doc(db, "aluno_historico",  'RA01', 'cursos', 'Excel Avançado'));
    docAlunoHistorico.then((resData)=>{
        let res = resData.data();
        res.RA = alunoInfo.RA;
        res.curso = alunoInfo.curso;
        res.nome = alunoInfo.nome;
        return res;
    }).then((res)=>{
        console.log(res);
        ipcRenderer.invoke("baixarHistoricoAluno", res);
        //teste(res)
    });

//----------------------------------------------
function teste(data){
    let result = new Promise((resolve, reject) => {
        let res = ipcRenderer.invoke("baixarHistoricoAluno", "ALUNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    
       // loadinContrato.style.display = "block";
        if (res) {
          resolve(res);
        } else {
          reject();
        }
      });
      
      result.then(() => {
       // loadinContrato.style.display = "none";
      });
        
}




  }//-------------//