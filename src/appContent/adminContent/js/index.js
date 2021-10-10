import * as commonFunc from "../../../components/js_common/commonFunctions.js";

//----------------------------------------------------
import {firebaseApp} from "../../../components/dbConfig/firebaseApp.js";
const {getAuth, signOut, signInWithEmailAndPassword,  onAuthStateChanged, updateProfile, createUserWithEmailAndPassword } =  require("firebase/auth");
const {getFirestore, doc, getDoc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);



function createNewUser(){
  let displayName = 'Belatriz Lestrange';
  let email = 'bela@example.com';
  let password = '123456';
  let photoURL = 'belatrizLestrange.jpg';
  let privilege = 'atendenter';
  let level = '1';
  createUserWithEmailAndPassword(auth, email, password, displayName)
  .then((currentUser)=>{
      currentUser.uid = currentUser.user.uid;
      currentUser.name = displayName;
      currentUser.photoURL = photoURL;
      currentUser.privilege = privilege;
      currentUser.level = level;
      updateUser(currentUser)
      return currentUser
  })
  .then((currentUser)=>{
    saveUserExtraInfo(currentUser) 
    return currentUser;
  }).then((currentUser)=>{
    console.log('/////////////////////');
    console.log(currentUser);
    console.log('/////////////////////');
  
  });
}

function updateUser(currentUser){
    const auth = getAuth(firebaseApp);
    updateProfile(currentUser, {
        displayName: currentUser.name, 
        photoURL: currentUser.photoURL
      }).then(() => {
        // Profile updated!
        // ...
      }).catch((error) => {
        // An error occurred
        // ...
      });
}

//createNewUser()


function saveUserExtraInfo(user) {

console.log('*********************');
console.log(user);
console.log('*********************');

setDoc(doc(db, 'users', user.uid),
      {
        name: user.name,
        privilege: user.privilege,
        level: user.level
      }

  ).catch((error) => console.error("Erro ao adicionar aula:", error));
}



 function getUserCompleteInfo(currentUser){

  let userInfo = getDoc(doc(db, "users",  currentUser.uid))
  .then((res)=>{
    let userInfo = {
      username: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      privilege: res.data()["privilege"]
    }
    return userInfo; 
  });
  return userInfo;
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
   document.querySelector("#user_privilege").textContent = userCompleteInfo.privilege;
  }

export function onload(){

    getUserCompleteInfo(auth.currentUser)
    .then((userCompleteInfo)=>{
     
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