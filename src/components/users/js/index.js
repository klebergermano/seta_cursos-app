//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Funções do componente
import { insertFormReauthUser } from "./formReauthUser.js";
import { insertFormConfigPerm } from "./formConfigPerm.js";
import { insertViewTableUsersHTML } from "./viewTableUsers.js";
//---------------------------------------------------------------//

export function getUserCompleteInfo(currentUser) {
  let userInfo = getDoc(doc(db, "users", currentUser.uid))
    .then((res) => {
      let userInfo = {
        uid: currentUser.uid,
        email: currentUser.email,
        username: res.data().name,
        photoURL: res.data().photoURL,
        privilege: res.data()["privilege"],
        role: res.data()["role"]
      }
      return userInfo;
    });
  return userInfo;
}

export function onload() {
  document.querySelector('#btn_users_info_table').addEventListener('click', (e) => {
    insertViewTableUsersHTML();
  })
  document.querySelector('#btn_add_user').addEventListener('click', (e) => {
    insertFormReauthUser();
  })
  document.querySelector('#btn_config_permissions').addEventListener('click', (e) => {
    insertFormConfigPerm();
  })
  insertViewTableUsersHTML();
}

