//----------------------------------------------------
import {firebaseApp} from "../../../components/dbConfig/firebaseApp.js";
const {getAuth, signOut, signInWithEmailAndPassword,  onAuthStateChanged, updateUser, updateProfile, createUserWithEmailAndPassword } =  require("firebase/auth");
const {getFirestore, doc, getDoc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);


import * as commonFun from "../../js_common/commonFunctions.js";
function teste(){
    console.log('Current User:------');
    console.log(auth.currentUser);
    console.log('-------------------');

    document.querySelectorAll('.get_user').forEach((item)=>{

        item.addEventListener('click', (e)=>{
            let uid = e.target.dataset.id;
            getDoc(doc(db, 'users', uid)).then((res)=>{
                console.log(res.data().privilege);
            });
    
        });
    })

}


export function onload(){
    teste()


commonFun.importHTMLWithScript('#home_content', './components/cursosInfo/index.html', '../../components/cursosInfo/js/index.js');    


}