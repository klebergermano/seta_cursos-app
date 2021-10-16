import * as commonFunc from "../../js_common/commonFunctions.js";
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");

const auth = getAuth(firebaseApp);


export function reLoginUser(userInfo, callback) {
    console.log(callback);
    console.log('func 5', userInfo);

    let email = userInfo.email;
    let password = userInfo.password;


    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            onAuthStateChanged(auth, (userCredential) => {
                if (userCredential) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    const uid = userCredential.uid;
                }
            });

            // Signed in 
            const user = userCredential.user;
            console.log('re-logado', auth.currentUser);
            if (callback) {
                callback();
            }
            // ...
        })
        .catch((error) => {

            console.log(error);
        });
}

