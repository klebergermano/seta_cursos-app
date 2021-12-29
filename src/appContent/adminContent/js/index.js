import * as users from "../../../components/users/js/index.js";
import * as commonFunc from "../../../components/js_common/commonFunctions.js";
import {checkRolePermission} from "./checkPermission.js"
//----------------------------------------------------
import {firebaseApp} from "../../../components/dbConfig/firebaseApp.js";
const {getAuth, signOut } =  require("firebase/auth");
const {getFirestore, doc, getDoc, setDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
//-----------------------------------------------------



 function getUserCompleteInfoX(currentUser){
  let userInfo = getDoc(doc(db, "users",  currentUser.uid))
  .then((res)=>{

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
  checkRolePermission(auth);
users.getUserCompleteInfo(auth.currentUser)
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
  document.querySelector('#bg_logo').addEventListener('click', ()=>{
    importHTML('#page_content', '../src/components/home/index.html', '../../../components/home/js/index.js' )
  })

  childs.forEach((item) => {

    item.addEventListener("click", (e) => {
      removeActiveNavMainMenuLateral();
      let htmlSRC = '../src/components/'+ e.target.dataset.path + '/index.html'; 
      let scriptSRC = '../../../components/'+ e.target.dataset.script_src + '/js/index.js'; 
      importHTML('#page_content', htmlSRC, scriptSRC);
      e.target.classList.add('active');

    });
  });
}

function removeActiveNavMainMenuLateral(){
  let childs = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");
  childs.forEach((item) => {
item.classList.remove('active');
  });

  
}