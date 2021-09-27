
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getAuth, signInWithEmailAndPassword} =  require("firebase/auth");

const auth = getAuth(firebaseApp);

import * as commonFunctions from "../../js_common/commonFunctions.js"

export function onload(){
    let form = document.querySelector('#form_login');
    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        let email = document.querySelector('#user_name').value;
        let password = document.querySelector('#password').value;
  
        //let email = "kleber_lsgermano@hotmail.com";
        //let password = "teste123";

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('logado', user);
        commonFunctions.importHTMLWithScript('#app', './appContent/adminContent.html', "../../appContent/adminContent.js" );
        
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        });

    });

        

}