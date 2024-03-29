//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js"
const { getAuth, reauthenticateWithCredential, EmailAuthProvider } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import { btnCloseForm } from "../../jsCommon/formsFunc.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import {insertFormAddUser} from "./formAddUser.js" 
//---------------------------------------------------------------//
//----------------------------------------------------------------------+
//TODO: Refatorar e comentar                                            |     
//----------------------------------------------------------------------+
export function insertFormReauthUser(){
    insertElementHTML('#page_users', './components/users/formReauthUser.html', eventsFormReauthUser);
}

function eventsFormReauthUser(){
    btnCloseForm('#form_reauth_user');
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

function removeElement(childElementID, callback) {
  let child = document.querySelector(childElementID);
  let parent = child.parentElement;
  parent.removeChild(child);
  if (callback) callback();
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
      document.querySelector("#form_reauth_user").style.opacity = '0';
      setTimeout(()=>{
        removeElement('.bg_form_block_screen');
      }, 300);
    }).then(()=>{
      //TODO: Função não existe
        setTimeout(()=>{
          insertFormAddUser(userReauthInfo)
          }, 300);
    })
    .catch((error) => {
      // An error ocurred
      console.log(error);

      // ...
    });
  
}

