import * as commonFunc from "../../js_common/commonFunctions.js";

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getAuth, signInWithEmailAndPassword,  onAuthStateChanged } =  require("firebase/auth");

const auth = getAuth(firebaseApp);

import * as commonFunctions from "../../js_common/commonFunctions.js"
var TESTE =  'TESTE';

console.log(TESTE);
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
            onAuthStateChanged(auth, (userCredential) => {
                if (userCredential) {
                  // User is signed in, see docs for a list of available properties
                  // https://firebase.google.com/docs/reference/js/firebase.User
                  const uid = userCredential.uid;
                  console.log(uid);
                  // ...
                } else {
                  // User is signed out
                  console.log('Logout');
                  commonFunc.importHTMLWithScript('#app', './components/login/index.html',"../login/js/index.js" )

                  // ...
                }
              });
            
        // Signed in 
        const user = userCredential.user;
        console.log('logado', user.email);
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