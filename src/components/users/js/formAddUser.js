import {insertElementHTML, btnCloseForm } from "../../js_common/commonFunctions.js";
import * as relogin from "./reLogin.js";
//----------------------------------------------------
import { firebaseApp } from "../../../components/dbConfig/firebaseApp.js"
const { getAuth, updatePassword, updateProfile, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
//------------------------------------------------------

export function insertFormAddUser(userReauthInfo) {
    insertElementHTML('#bg_form_add_user', './components/users/formAddUser.html', () => {
        eventsFormAddUser(userReauthInfo)
    });
}
function eventsFormAddUser(userReauthInfo) {
   btnCloseForm('#form_add_user');
   document.querySelector('#form_add_user').addEventListener('submit', (e) => {
        e.preventDefault();
        submitFormAddUser(form, userReauthInfo)
    });
}

//-------------------------------------------------------
//createNewUser()
//-------------------------------------------------------

function submitFormAddUser(form, userReauthInfo) {
    let newUserInfo = {
        name: form.username.value,
        email: form.user_email.value,
        password: form.user_password.value,
        photoURL: form.user_photoURL.value,
        role: form.select_user_role.value,
        privilege: form.user_privilege.value
    };

    createUserWithEmailAndPassword(auth, newUserInfo.email, newUserInfo.password)
        .then((newUserCredential) => {
            newUserInfo.uid = newUserCredential.user.uid;

        })
        .then(() => {
            relogin.reLoginUser(userReauthInfo, () => {
                saveUserExtraInfo(newUserInfo)
            })
        })
        .then(() => {
            commonFunc.defaultEventsAfterSubmitForm('#form_add_user', "Usuário adicionado com sucesso!")
        })
        .catch((error) => console.log(error.code, error.message));
}

function saveUserExtraInfo(newUser) {

    setDoc(doc(db, 'users', newUser.uid),
        {
            photoURL: newUser.photoURL,
            email: newUser.email,
            name: newUser.name,
            privilege: newUser.privilege,
            role: newUser.role
        }

    ).catch((error) => console.error("Erro ao adicionar Extra info User:", error));
}

