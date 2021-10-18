import * as commonFunc from "../../js_common/commonFunctions.js";
import * as permissionsFunc from "./permissions.js";

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, collection, getDocs, doc, setDoc, getDoc } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);



export function insertFormConfigPerm(){
    commonFunc.insertElementHTML('#bg_form_add_user', './components/users/formConfigPerm.html', ()=>{
        eventsFormConfigPerm()

    });
    commonFunc.displayBlockScreen();
}

function eventsFormConfigPerm(){
    commonFunc.btnCloseForm("#form_config_perm");
    insertPermissionTextarea()
    let form = document.querySelector("#form_config_perm")
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        submitConfigPerm();        
    })
}

function insertPermissionTextarea(){
    permissionsFunc.getPermissions().then((permissions)=>{
        document.querySelector('#form_config_perm')
        .querySelector('#textarea_permissions')
        .innerHTML = JSON.stringify(permissions.data(), null, '\t') ;
    });
}

export function submitConfigPerm(){
    let form = document.querySelector('#form_config_perm');

    let permissions = JSON.parse(form.textarea_permissions.value);
 
    setDoc(doc(db, 'users', 'permissions'), permissions)
    .then(()=>{
        console.log('PERMISSIONS:', permissions)
        commonFunc.defaultEventsAfterSubmitForm('#form_config_perm', "Permissões adicionadas com sucesso!");
    })
    .catch((error) => console.error("Erro ao adicionar permissões de usuário:", error));

}

