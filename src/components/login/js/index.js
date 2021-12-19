import * as commonFunc from "../../js_common/commonFunctions.js";
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getAuth, signInWithEmailAndPassword,  onAuthStateChanged } =  require("firebase/auth");

const auth = getAuth(firebaseApp);

export function onload(){
    let form = document.querySelector('#form_login');
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        let email = document.querySelector('#user_name').value;
        let password = document.querySelector('#password').value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            onAuthStateChanged(auth, (userCredential) => {
                if (userCredential) {
                  // User is signed in, see docs for a list of available properties
                  // https://firebase.google.com/docs/reference/js/firebase.User
                  const uid = userCredential.uid;
                  // ...
                } else {
                  // User is signed out
                  commonFunc.importHTMLWithScript('#app', './components/login/index.html',"../login/js/index.js" )
                }
              });
            
        // Signed in 
        const user = userCredential.user;
        commonFunc.importHTMLWithScript('#app', './appContent/adminContent/index.html', "../../appContent/adminContent/js/index.js" );
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        });

    });

        

}