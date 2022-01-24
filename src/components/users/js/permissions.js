import * as commonFunc from "../../js_common/commonFunctions.js";

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, setDoc, getDoc, query, where } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

export function getPermissions(){
    let permissions = {}
    let perm = getDocs(collection(db, 'permissions'))
    .then((perm)=>{
        perm.forEach((item)=>{
            permissions[item.id] = item.data();
        })
        return permissions
    }).catch((error)=>{ console.log(error)})
    return perm;
    }

    export function getRolePermission(userRole){
    let permission = getDoc(doc(db, 'permissions', userRole))
        return permission
    }