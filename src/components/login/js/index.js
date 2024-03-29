//Electron
var appVersion = require("electron").remote.app.getVersion();
//---------------------------------------------------------------//
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
const { getFirestore, doc, getDoc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Componentes
import importHTMLWithScript from "../../jsCommon/importHTMLWithScript.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";

//---------------------------------------------------------------//

export function onload() {
  let form = document.querySelector('#form_login');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.querySelector('#user_name').value;
    let password = document.querySelector('#password').value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        onAuthStateChanged(auth, (userCredential) => {
          if (!userCredential){
           // User is signed out
           importHTMLWithScript('#app', './components/login/index.html', "../login/js/index.js")
          }
        });
        // Signed in 
        getDoc(doc(db, "metadata", "last_version")).then((res) => {
          if (res.data().version !== appVersion) {
            //Cerrega página de updateVersion
            insertElementHTML('#app', './appContent/updateAppVersion.html', () => {
              eventsUpdateAppVersion(res.data(), appVersion)
            }, null, true);
          } else {
            importHTMLWithScript('#app', './appContent/index.html', "../../appContent/js/index.js");
          };
        })
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        displayMsgErrorLogin(errorCode);
        console.log(errorCode, errorMessage);
      });
  });

}

function displayMsgErrorLogin(errorCode){
let div = document.createElement('div');
div.id = 'error_login_msg'; 
let msg = '<p>Houve um erro ao tentar logar, por favor tente novamente.</p>'; 
if(errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found'){
  msg = '<p>Senha ou usuário não encontrados, tente novamente.</p>'
}else if(errorCode === 'auth/too-many-requests'){
  msg = `<p>Multiplas tentativas de login falharam. Por motivo de segurança, o acesso a essa conta foi temporariamente suspenso.</p>`
}
else if(errorCode === 'auth/invalid-email'){
  msg = `<p>Email inválido.</p>`
}
else{
  console.log('errorCode:', errorCode)
}

div.innerHTML = msg; 
form_login.insertAdjacentElement('afterbegin', div);
setTimeout(()=>{
  form_login.removeChild(div);
}, 5000)

}

function eventsUpdateAppVersion(versionData, oldVersion) {
  let div = document.createElement('div')
  if (versionData.download !== "") {
    div.innerHTML = `
    <p>Para atualizar da sua versão antiga: <span style='color:red'>${oldVersion} </span> para a nova versão: <b style='color:blue'>${versionData.version}</b></p>
    <p>
    utilize o link abaixo ou entre em contato com o administrador do sistema.</p>
    <br/>
    <a target='_blank' href='${versionData.download}'>Download</a></p>`;
  } else {
    div.innerHTML = `<br/>
    <p>Para atualizar da sua versão antiga: <span style='color:red'>${oldVersion} </span> para a nova versão: <b style='color:blue'>${versionData.version}</b></p>
 
    <p><b style='color:blue'>solicite o aplicativo atualizado com o administrador do sistema.</b></p>`;
  }
  document.querySelector("#update_app_content #update_message").insertAdjacentElement('beforeend', div);


}