//Electron
var appVersion = require("electron").remote.app.getVersion();
//Firebase
import { firebaseApp } from "../../components/dbConfig/firebaseApp.js";
const { getAuth, signOut } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import importHTMLWithScript from "../../components/jsCommon/importHTMLWithScript.js";
import { getUserCompleteInfo } from "../../components/users/js/index.js";
import { getRolePermission } from "../../components/users/js/permissions.js";
import insertElementHTML from "../../components/jsCommon/insertElementHTML.js";
import viewTodolist from "./viewTodolist.js"; 
//---------------------------------------------------------------//
//Funções do AdminContent
import { timerIdleMouseMoveFunc } from "./timerIdle.js";
import { checkRolePermission } from "./checkPermission.js";
//---------------------------------------------------------------//

export function onload() {
  (function setGlobalPermissionInfo() {
    getUserCompleteInfo(auth.currentUser).then((userCompleteInfo) => {
      getRolePermission(userCompleteInfo.role).then((res) => {
        window.$PERMISSIONS = res.data();
      });
    });
  })();

  //timer conta em segundos 5 * 60 = 5 min
  timerIdleMouseMoveFunc(10 * 60, () => {
    signOut(auth)
      .catch(err => console.log(err));
  });

  //Remove os elementos sem autorização
  checkRolePermission(auth);

  //Cerrega página principal da home
  importHTMLWithScript('#page_content', "./components/home/index.html", "../home/js/index.js");

  //Seta a versão no footer
  document.querySelector('footer').innerHTML = `<p class='app_version'>Versão: ${appVersion}</p>`;

  //Eventos do appComponent.
  insertElementsHTMLAppComponent()
}

// Carrega os eventos do header.
function eventsHeaderAppContent() {
  //carrega função de logout no header buttom.
  document.querySelector("#btn_logout_user").addEventListener('click', () => {
    signOut(auth)
      .catch(err => console.log(err));
  })
  // Pega as informações do usuário logado.
  getUserCompleteInfo(auth.currentUser)
    .then((userCompleteInfo) => {
      // Seta a informação do login.
      setLoginInfo(userCompleteInfo)
    }).catch(err => console.log(err));

  let btn_todolist = document.querySelector('#btn_todolist');
  btn_todolist.addEventListener('click', ()=>{
    viewTodolist.insertViewTodolist();
  })  
}

// Cria o icone do usuário.
function createUserIcon(photoURL) {
  let imgUserIcon = document.createElement('img');
  imgUserIcon.setAttribute('src', `../src/assets/img/usersIcons/${photoURL}`);
  return imgUserIcon;
}

// Insere os elementos HTML do ".appContent".
function insertElementsHTMLAppComponent() {
  insertElementHTML(".appContent", "./appContent/headerAdmin.html", eventsHeaderAppContent);
  insertElementHTML(".appContent", "./appContent/mainMenuLateralAdmin.html", eventsMainMenuLateralAdmin);
}


// Adiciona as informações do usuário logado no header.
function setLoginInfo(userCompleteInfo) {
  // Insere texto com o nome do usuário em "#username".
  document.querySelector("#username").textContent = userCompleteInfo.username;

  // Insere o ícone do usuário no "#user_con".
  document.querySelector("#user_icon").appendChild(createUserIcon(userCompleteInfo.photoURL));

  // Insere texto com o privilégio do usuário em "#user_role".
  document.querySelector("#user_role").textContent = userCompleteInfo.role;
}

//Insere os eventos do menu lateral principal "#nav_main_menu_lateral_admin".
function eventsMainMenuLateralAdmin() {
  // Pega todos os elementos 'A' do menu lateral.
  let aElements = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");

  // Adiciona o evento click nos elementos 'A'.
  aElements.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Remove a classe 'active' do main menu lateral.
      removeClassActiveMainMenuLateral();

      // Importa o html baseado no dataset do item clicado. 
      let htmlSRC = '../src/components/' + item.dataset.path + '/index.html';
      let scriptSRC = '../../components/' + item.dataset.script_src + '/js/index.js';
      importHTMLWithScript('#page_content', htmlSRC, scriptSRC);

      // Adiciona classe active no item clicado.
      item.classList.add('active');
    });
  });
}

// Remove a classe "active" de todos os elementos A do "#main_menu_lateral". 
function removeClassActiveMainMenuLateral() {
  let childs = document.querySelector('#nav_main_menu_lateral_admin').querySelectorAll("a");
  childs.forEach((item) => {
    item.classList.remove('active');
  });
}

