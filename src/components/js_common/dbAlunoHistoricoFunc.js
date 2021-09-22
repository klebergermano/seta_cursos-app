const {initializeApp} = require("firebase/app") 
const {getFirestore, collection, getDocs, doc, getDoc, onSnapshot } = require("firebase/firestore") 
const firebaseConfig = {
  apiKey: "AIzaSyCQ0IIED6S4yHGwd4iePApe3IDmrVW6-Cs",
  authDomain: "seta-cursos-app.firebaseapp.com",
  projectId: "seta-cursos-app",
  storageBucket: "seta-cursos-app.appspot.com",
  messagingSenderId: "604551662801",
  appId: "1:604551662801:web:617516e76e3f23ce35c9f0",
  measurementId: "G-MB10BFHBQ0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//---------------
export function alunoHistCursosRealTimeDB(RA, callback) {
  console.log(RA);
  onSnapshot(
    collection(db, 'aluno_historico', RA, 'cursos'), 
    (snapshot)=>{
    callback(RA, snapshot.docChanges());

  });
}


export function alunoHistCursosRealTimeDBXXXXXX(RA, callback) {
    db.collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .onSnapshot((snapshot) => {
        callback(RA, snapshot.docChanges());
    });
  }

 
  
export function getAlunosListRA() {
    let alunosList = db.collection("aluno_historico").get();
    let IDs = [];
    let alunoListRA = alunosList.then((res) => {
      res.forEach((item) => {
        IDs.push(item.id);
      });
      return IDs.reverse();
    });
    return alunoListRA;
  }

  export async function getAlunoInfoGeral(RA) {
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
  
  export function getAlunoHistCursosDB(RA) {
let alunoHistorico = getDocs(collection(db, 'aluno_historico', RA, 'cursos'));
return alunoHistorico;
  }
  

export function getAlunoHistCursosDBXXXXXXXXXXXXXX(RA) {
    let alunoHistorico = db
      .collection("aluno_historico")
      .doc(RA)
      .collection("cursos")
      .get();
  
    return alunoHistorico;
  }
  
