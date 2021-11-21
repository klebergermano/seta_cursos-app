
//firestore
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection} = require("firebase/firestore");
const db = getFirestore(firebaseApp);

//Components
import {insertElementHTML, defaultEventsAfterSubmitFixedForm} from "../../js_common/commonFunctions.js";
//------------------------------------------------------------------------

export function insertInfoAlunoHTML(RA){
   insertElementHTML('#alunos_content',
  './components/alunos/infoAluno.html', ()=>{eventsInfoAluno(RA)}, null, true
  );
}


function eventsInfoAluno(RA){
    console.log('events', RA);
}