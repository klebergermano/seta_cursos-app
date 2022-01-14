import { getUserCompleteInfo } from "../../../components/users/js/index.js";
import { importHTMLWithScript } from "../../../components/js_common/commonFunctions.js";
import { checkRolePermission } from "./checkPermission.js";
import { timerIdleMouseMoveFunc } from "./timerIdle.js";
//----------------------------------------------------
import { firebaseApp } from "../../../components/dbConfig/firebaseApp.js";
const { getAuth, signOut } = require("firebase/auth");

const auth = getAuth(firebaseApp);
//-----------------------------------------------------

import {getRolePermission} from "../../../components/users/js/permissions.js";

var appVersion = require("electron").remote.app.getVersion();



//------------------------------------------------------


export function onload() {
  (function setGlobalPermissionInfo(){
    getUserCompleteInfo(auth.currentUser).then((userCompleteInfo)=>{
      getRolePermission(userCompleteInfo.role).then((res)=>{
        window.$PERMISSIONS = res.data();
      });
    });
  })();


  //timer conta em segundos 5 * 60 = 5 min
  timerIdleMouseMoveFunc(5 * 60, () => {
    signOut(auth)
    .catch(err => console.log(err));
  });

  //Remove os elementos sem autorização
  checkRolePermission(auth);

  //Pega as informações do usuário logado
  getUserCompleteInfo(auth.currentUser)
    .then((userCompleteInfo) => {
      setLoginInfo(userCompleteInfo)
    }).catch(err => console.log(err))

  //Carrega eventos do menu principal
  eventsMainMenu()

  //carrega função de logout no header buttom 
  document.querySelector("#logout_user").addEventListener('click', () => {
    signOut(auth)
      .catch(err => console.log(err));


  })

  //Cerrega página principal da home
  importHTMLWithScript('#page_content', "./components/home/index.html", "../home/js/index.js");

  //Seta a versão no footer
  document.querySelector('footer').innerHTML = `<p class='app_version'>Versão: ${appVersion}</p>`;
}




//Função usada no lugar do importHTMLWithScript 
//TODO: Conferir utilidade da função duplicada
function importHTML(target, htmlSRC, scriptSRC) {
  let element = document.querySelector(target);
  fetch(htmlSRC)
    .then((res) => res.text())
    .then((html) => {
      element.innerHTML = html;
      import(scriptSRC)
        .then((module) => {
          module.onload();
        });
    })
}

function setLoginInfo(userCompleteInfo) {
  document.querySelector("#username").textContent = userCompleteInfo.username;
  let imgUserIcon = document.createElement('img');
  imgUserIcon.setAttribute('src', `../src/assets/img/usersIcons/${userCompleteInfo.photoURL}`);
  document.querySelector("#user_icon").appendChild(imgUserIcon);
  document.querySelector("#user_role").textContent = userCompleteInfo.role;
}

function eventsMainMenu() {
  let childs = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");
  document.querySelector('#bg_logo').addEventListener('click', () => {
    importHTML('#page_content', '../src/components/home/index.html', '../../../components/home/js/index.js')
  })
  childs.forEach((item) => {
    item.addEventListener("click", (e) => {
      removeActiveNavMainMenuLateral();
      let htmlSRC = '../src/components/' + e.target.dataset.path + '/index.html';
      let scriptSRC = '../../../components/' + e.target.dataset.script_src + '/js/index.js';
      importHTML('#page_content', htmlSRC, scriptSRC);
      e.target.classList.add('active');

    });
  });
}
function removeActiveNavMainMenuLateral() {
  let childs = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");
  childs.forEach((item) => {
    item.classList.remove('active');
  });

}