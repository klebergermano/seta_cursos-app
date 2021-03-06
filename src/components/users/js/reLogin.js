//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
export function reLoginUser(userInfo, callback) {
    let email = userInfo.email;
    let password = userInfo.password;

    //TODO: refatorar;
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
            if (callback) {
                callback();
            }
            // ...
        })
        .catch((error) => {

            console.log(error);
        });
}

