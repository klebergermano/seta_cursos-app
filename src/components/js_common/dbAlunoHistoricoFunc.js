
import {firebaseApp} from "../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot,  where, query  } = require("firebase/firestore") 
export const db = getFirestore(firebaseApp);

//---------------
export function alunoHistCursosRealTimeDB(RA, callback) {
  onSnapshot(
    collection(db, 'alunato', RA, 'cursos'), 
    (snapshot)=>{
    callback(RA, snapshot.docChanges());
  });
}

export function getAlunosListRA() {
let alunosList = getDocs(collection(db, 'alunato'));
let IDs = [];
let alunoListRA = alunosList.then((list)=>{
  list.forEach((item)=>{
    IDs.push(item.id);

  });
  return IDs.reverse();

});
return alunoListRA;

}

  export function getAlunoHistCursosDB(RA) {
let alunoHistorico = getDocs(collection(db, 'alunato', RA, 'cursos'));
if(alunoHistorico === 'undefined'){
  alunoHistorico = []
}
return alunoHistorico;
  }
  

