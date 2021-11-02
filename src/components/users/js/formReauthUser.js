import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAdduser from "./formAddUser.js"
//----------------------------------------------------
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
import { insertFormAddUser } from "./formAddUser.js";
const { getAuth, reauthenticateWithCredential, EmailAuthProvider } = require("firebase/auth");
const auth = getAuth(firebaseApp);


export function insertFormReauthUser(){
    commonFunc.insertElementHTML('#page_users', './components/users/formReauthUser.html', eventsFormReauthUser);
    commonFunc.displayBlockScreen();
}

function eventsFormReauthUser(){
    commonFunc.btnCloseForm('#form_reauth_user');
    insertAuthEmailInput()
    let form = document.querySelector('#form_reauth_user');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitFormReauthUser(form)
    });

}

function insertAuthEmailInput(){
document.querySelector("#form_reauth_user").querySelector("#user_email").value = auth.currentUser.email;
document.querySelector("#form_reauth_user").querySelector("#user_email").setAttribute('readonly', true);

}

function submitFormReauthUser(form){

    const user = auth.currentUser;
    // TODO(you): prompt the user to re-provide their sign-in credentials
    let userReauthInfo = {
        email : form.user_email.value,
       password : form.user_password.value
    }

let credentials = EmailAuthProvider.credential( userReauthInfo.email, userReauthInfo.password);

    reauthenticateWithCredential(user, credentials).then(() => {
      // User re-authenticated.
      console.log('Reauthenticado com sucesso!');
      commonFunc.removeElement('#form_reauth_user', ()=>{
          commonFunc.removeBlockScreen();
      });
    
    }).then(()=>{
        formAdduser.insertFormAddUser(userReauthInfo)
    })
    .catch((error) => {
      // An error ocurred
      console.log(error);

      // ...
    });
  
}

