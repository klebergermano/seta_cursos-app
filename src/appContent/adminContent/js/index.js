import * as commonFunc from "../../../components/js_common/commonFunctions.js";

//----------------------------------------------------
import {firebaseApp} from "../../../components/dbConfig/firebaseApp.js";
const {getAuth, signOut, signInWithEmailAndPassword,  onAuthStateChanged, updateProfile } =  require("firebase/auth");
const {getFirestore, doc, getDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
function updateUserFirebase(){
  let userInfo = {
    name: "Kleber Germano",
    photoURL: "kleberGermano.jpg",
    }
    const auth = getAuth(firebaseApp);
    updateProfile(auth.currentUser, {
        displayName: userInfo.name, 
        photoURL: userInfo.photoURL
      }).then(() => {
        // Profile updated!
        // ...
      }).catch((error) => {
        // An error occurred
        // ...
      });
}
 function getUserCompleteInfo(currentUser){

  let userInfo = getDoc(doc(db, "users",  currentUser.uid))
  .then((res)=>{
    let userInfo = {
      username: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      privilegio: res.data()["privilégio"]
    }
    return userInfo; 
  });
  return userInfo;
  }
function createNewUserFirebase(user){
    const auth = getAuth(firebaseApp);
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
}

//------------------------------------------------------

function importHTML(target, htmlSRC, scriptSRC){
    let element = document.querySelector(target);
    fetch(htmlSRC)
    .then((res)=> res.text())
    .then((html)=>{
      element.innerHTML = html;
      import(scriptSRC)
      .then((module)=>{
        module.onload();
      });
    })
  }
 
  function setLoginInfo(userCompleteInfo){

   let userInfo = userCompleteInfo;
   document.querySelector("#username").textContent = userCompleteInfo.username;
   document.querySelector("#user_icon_img").src = '../src/assets/img/userIcon/'+userCompleteInfo.photoURL;
   document.querySelector("#user_privilegio").textContent = userCompleteInfo.privilegio;
  }

export function onload(){
    getUserCompleteInfo(auth.currentUser)
    .then((userCompleteInfo)=>{
      console.log(userCompleteInfo);
      setLoginInfo(userCompleteInfo)
    })
  //updateUserFirebase()

  document.querySelector("#logout_user").addEventListener('click', ()=>{
    signOut(auth).then(() => {
      // Sign-out successful.
     // commonFunc.importHTMLWithScript('#app', './components/login/index.html',"../login/js/index.js" )
    //  console.log('Sign out');
    }).catch((error) => {
      // An error happened.
    });
  })

  commonFunc.importHTMLWithScript('#page_content', "./components/home/index.html", "../home/js/index.js");


let childs = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");
childs.forEach((item) => {
  item.addEventListener("click", (e) => {
    let htmlSRC = '../src/components/'+ e.target.dataset.path + '/index.html'; 
    let scriptSRC = '../../../components/'+ e.target.dataset.script_src + '/js/index.js'; 

    importHTML('#page_content', htmlSRC, scriptSRC);
  });
});
}