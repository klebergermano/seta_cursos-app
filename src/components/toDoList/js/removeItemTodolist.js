
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, updateDoc, deleteField, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import { confirmBoxDelete } from "../../jsCommon/confirmBoxFunc.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//

function deleteItemTodolistDB(idItem) {
    let deleteQuery = {};
    deleteQuery[idItem] = deleteField();
    const docTodolist = doc(db, 'users', auth.currentUser.uid, 'content', 'to-do_list');
    updateDoc(docTodolist, deleteQuery).then(() => {
        //checkIfBimestreIsEmptyToDelete(aulaInfoDelete)
    })
        .then(() => {
            //addLogInfo('log_alunato', 'delete', `${RA} - ${curso} - ${bimestre} - delete_${aula}`);
        })
        .catch((error) => {
            console.log(error);
           // addLogInfo('log_alunato', 'error', `${RA} - ${curso} - ${bimestre} - delete_${aula}`, error);
        });
}


 const removeItemTodolist = (e) => {
    const btn = e.target; 
    const tr = btn.closest('tr'); 
        const itemID = tr.dataset.item_id; 
   deleteItemTodolistDB(itemID)
}
export default removeItemTodolist; 