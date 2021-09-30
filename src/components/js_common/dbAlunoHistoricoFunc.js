
import {firebaseApp} from "../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
export const db = getFirestore(firebaseApp);



//---------------
export function alunoHistCursosRealTimeDB(RA, callback) {
  onSnapshot(
    collection(db, 'aluno_historico', RA, 'cursos'), 
    (snapshot)=>{
    callback(RA, snapshot.docChanges());
  });
}

export function getAlunosListRA() {
let alunosList = getDocs(collection(db, 'aluno_historico'));
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
let alunoHistorico = getDocs(collection(db, 'aluno_historico', RA, 'cursos'));
return alunoHistorico;
  }
  

  
  async function getAlunoInfoGeral(RA) {
    let alunoInfo = await db
      .collection("aluno_historico")
      .doc(RA)
      .get()
      .then((res) => {
        return res.data();
      });
    alunoInfo.RA = RA;
    return alunoInfo;
  }
  
