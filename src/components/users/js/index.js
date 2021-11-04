
import * as formReauthUser from "./formReauthUser.js";
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
import * as userPermissions from "./formConfigPerm.js";
import * as formConfigPerm from "./formConfigPerm.js";
import * as usersInfoTable from "./usersInfoTable.js";

//Firebase
const {getFirestore, collection, getDocs, doc,  getDoc } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

export function getUserCompleteInfo(currentUser){
    let userInfo = getDoc(doc(db, "users",  currentUser.uid))
    .then((res)=>{
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

export function onload(){
    document.querySelector('#btn_users_info_table').addEventListener('click', (e)=>{
      usersInfoTable.insertUsersInfoTable();
    })
    document.querySelector('#btn_add_user').addEventListener('click', (e)=>{
      formReauthUser.insertFormReauthUser();
    })
    document.querySelector('#btn_config_permissions').addEventListener('click', (e)=>{
       formConfigPerm.insertFormConfigPerm();
    })
  usersInfoTable.insertUsersInfoTable();
}

