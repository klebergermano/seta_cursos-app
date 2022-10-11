
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, updateDoc, deleteField, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//--------------------------------
import atualizaViewTodoList from "./atualizaViewTodoList.js"; 

function deleteItemTodolistDB(idItem) {
    let deleteQuery = {};
    deleteQuery[idItem] = deleteField();
    const docTodolist = doc(db, 'users', auth.currentUser.uid, 'content', 'to-do_list');
    updateDoc(docTodolist, deleteQuery)
        .then(() => { atualizaViewTodoList() })
        .catch((error) => {
            console.log(error);
        });
}


 const removeItemTodolist = itemID => deleteItemTodolistDB(itemID)

export default removeItemTodolist; 