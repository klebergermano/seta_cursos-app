//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
//Funções do componente
import { getPermissions } from "./permissions.js";
//---------------------------------------------------------------//

export function insertFormConfigPerm() {
    insertElementHTML('#page_users', './components/users/formConfigPerm.html', () => {
        eventsFormConfigPerm()
    });
}

function eventsFormConfigPerm() {
    btnCloseForm("#form_config_perm");
    insertPermissionTextarea()
    let form = document.querySelector("#form_config_perm")
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitConfigPerm();
    })
}

function insertPermissionTextarea() {
    getPermissions()
        .then((permissions) => {
            let textareaPerm = {};
            for (let item in permissions) {
                textareaPerm[item] = permissions[item];
            }
            return textareaPerm;
        }).then((textareaPerm) => {
            document.querySelector('#form_config_perm')
                .querySelector('#textarea_permissions')
                .innerHTML = JSON.stringify(textareaPerm, null, '\t');
        })
}

export function submitConfigPerm() {
    let form = document.querySelector('#form_config_perm');
    let permissions = JSON.parse(form.textarea_permissions.value);

    for (let item in permissions) {
        setDoc(doc(db, 'permissions', item), permissions[item])
            .then(() => {
                defaultEventsAfterSubmitForm('#form_config_perm', "Permissões adicionadas com sucesso!");
            })
            .then(() => {
                //TODO: corrigir função sem utilizar o setTimeout.
                //setTimeout usado para contornar o problema de tempo de execução entre o for e a função asincrona addLogInfo.
                //sem o setTimeout o addLogInfo sobrescreve aomenos uma das entradas no log.
                setTimeout(() => {
                    addLogInfo("log_users", 'update', item)
                }, 1000);
            })
            .catch((error) => {
                addLogInfo("log_users", 'error', item, error);
                console.error("Erro ao adicionar permissões de usuário:", error);
            })
    }
}

