import {btnCloseForm, insertElementHTML, defaultEventsAfterSubmitForm} from "../../js_common/commonFunctions.js";
import * as permissionsFunc from "./permissions.js";

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore,  doc, setDoc } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);



export function insertFormConfigPerm(){
    insertElementHTML('#page_users', './components/users/formConfigPerm.html', ()=>{
        eventsFormConfigPerm()
    });
}

function eventsFormConfigPerm(){
   btnCloseForm("#form_config_perm");
    insertPermissionTextarea()
    let form = document.querySelector("#form_config_perm")
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        submitConfigPerm();        
    })
}

function insertPermissionTextarea(){
    permissionsFunc.getPermissions()
    .then((permissions)=>{
        let textareaPerm = {}; 
        for(let item in permissions){
           textareaPerm[item] = permissions[item];
        }
        return textareaPerm;
    }).then((textareaPerm)=>{
        document.querySelector('#form_config_perm')
        .querySelector('#textarea_permissions')
        .innerHTML = JSON.stringify(textareaPerm, null, '\t') ;
    })

}

export function submitConfigPerm(){
    let form = document.querySelector('#form_config_perm');
    let permissions = JSON.parse(form.textarea_permissions.value);
    for(let item in permissions){
        setDoc(doc(db, 'permissions', item), permissions[item])
        .then(()=>{
            defaultEventsAfterSubmitForm('#form_config_perm', "Permissões adicionadas com sucesso!");
        })
        .catch((error) => console.error("Erro ao adicionar permissões de usuário:", error));
    
    }

}

