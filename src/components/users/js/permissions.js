import * as commonFunc from "../../js_common/commonFunctions.js";

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, setDoc, getDoc } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

export function getPermissions(){
    let permissions = getDoc(doc(db, 'users', 'permissions'))
    return permissions;
    }