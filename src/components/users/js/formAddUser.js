//Firebase
import { firebaseApp } from "../../../components/dbConfig/firebaseApp.js"
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm, defaultEventsAfterSubmitForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
//---------------------------------------------------------------//
//Funções do componente
import { reLoginUser } from "./reLogin.js";
//---------------------------------------------------------------//

export function insertFormAddUser(userReauthInfo) {
    insertElementHTML('#bg_form_add_user', './components/users/formAddUser.html', () => {
        eventsFormAddUser(userReauthInfo)
    });
}
function eventsFormAddUser(userReauthInfo) {
    btnCloseForm('#form_add_user');
    document.querySelector('#form_add_user').addEventListener('submit', (e) => {
        e.preventDefault();
        let form = e.target;
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
            reLoginUser(userReauthInfo, () => {
                saveUserExtraInfo(newUserInfo)
            })
        })
        .then(() => {
            defaultEventsAfterSubmitForm('#form_add_user', "Usuário adicionado com sucesso!")
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

