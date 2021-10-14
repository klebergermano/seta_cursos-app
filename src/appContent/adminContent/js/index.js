import * as commonFunc from "../../../components/js_common/commonFunctions.js";

//----------------------------------------------------
import {firebaseApp} from "../../../components/dbConfig/firebaseApp.js";
const {getAuth, signOut, signInWithEmailAndPassword,  onAuthStateChanged,  updatePassword, updateProfile, createUserWithEmailAndPassword } =  require("firebase/auth");
const {getFirestore, doc, getDoc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

//-------------------------------------------------------
//createNewUser()
//-------------------------------------------------------
function createNewUser(){
  let displayName = 'ABellatrix Lestrange';
  let email = '2@email.com';
  let password = '123456';
  let photoURL = 'atendenteDefault.png';
  let role = 'atendente';
  let privilege = '1';
  createUserWithEmailAndPassword(auth, email, password)
  .then((currentUser)=>{
      currentUser.uid = currentUser.user.uid;
      currentUser.email = currentUser.user.email;
      currentUser.name = displayName;
      currentUser.photoURL = photoURL;
      currentUser.privilege = privilege;
      currentUser.role = role;
    saveUserExtraInfo(currentUser) 
     
  }).catch(err => console.log(err))
}

//updatePasswordUser()
function updatePasswordUser(){
let newPassword = '123456'
updatePassword(auth.currentUser, newPassword )
.then(()=>{
  console.log('Password atualizado com sucesso!')
}).catch(erro => console.log(err));
}
//updateUser()
function updateUser(){
  updateProfile(auth.currentUser, {
  
  }).then(()=>{
    console.log('Atualizado com sucesso');
  }).catch(err => console.log(err));
}

function saveUserExtraInfo(user) {
setDoc(doc(db, 'users', user.uid),
      {
        photoURL: user.photoURL,
        email: user.email,
        name: user.name,
        privilege: user.privilege,
        role: user.role
      }

  ).catch((error) => console.error("Erro ao adicionar aula:", error));
}

 function getUserCompleteInfo(currentUser){
  let userInfo = getDoc(doc(db, "users",  currentUser.uid))
  .then((res)=>{
    console.log('getUserCompleteInfo:', res);

    let userInfo = {
      email: currentUser.email,
      username: res.data().name,
      photoURL: res.data().photoURL,
      privilege: res.data()["privilege"],
      role: res.data()["role"]
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
   document.querySelector("#username").textContent = userCompleteInfo.username;
   let imgUserIcon = document.createElement('img');
   imgUserIcon.setAttribute('src', `../src/assets/img/usersIcons/${userCompleteInfo.photoURL}`);
   document.querySelector("#user_icon").appendChild(imgUserIcon);
   document.querySelector("#user_role").textContent = userCompleteInfo.role;
  }

export function onload(){


getUserCompleteInfo(auth.currentUser)
    .then((userCompleteInfo)=>{
      setLoginInfo(userCompleteInfo)
    })
  document.querySelector("#logout_user").addEventListener('click', ()=>{
    signOut(auth).then(() => {
      
    }).catch((error) => {
    
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