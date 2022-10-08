
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, updateDoc, deleteField, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//--------------------------------
import viewTodolist from "./viewTodolist.js"; 



function deleteItemTodolistDB(idItem) {
    let deleteQuery = {};
    deleteQuery[idItem] = deleteField();
    const docTodolist = doc(db, 'users', auth.currentUser.uid, 'content', 'to-do_list');
    updateDoc(docTodolist, deleteQuery)
    .then(() => {
        //Chama a função duas vezes, para que remova e readicione o viewTodoList.
        viewTodolist.appendOrRemoveViewTodolist();
        viewTodolist.appendOrRemoveViewTodolist();

    })
       
        .catch((error) => {
            console.log(error);
           // addLogInfo('log_alunato', 'error', `${RA} - ${curso} - ${bimestre} - delete_${aula}`, error);
        });
}


 const removeItemTodolist = itemID => deleteItemTodolistDB(itemID)

export default removeItemTodolist; 