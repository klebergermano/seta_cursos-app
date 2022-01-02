import { importHTMLWithScript, insertElementHTML } from "../../js_common/commonFunctions.js";
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require("firebase/auth");
const { getFirestore, doc, getDoc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
var appVersion = require("electron").remote.app.getVersion();

export function onload() {
  let form = document.querySelector('#form_login');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.querySelector('#user_name').value;
    let password = document.querySelector('#password').value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        onAuthStateChanged(auth, (userCredential) => {
          if (userCredential) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = userCredential.uid;
            // ...
          } else {
            // User is signed out
            importHTMLWithScript('#app', './components/login/index.html', "../login/js/index.js")
          }
        });
        // Signed in 
        getDoc(doc(db, "metadata", "last_version")).then((res) => {
          if (res.data().version !== appVersion) {
            //Cerrega página principal da home
            // importHTMLWithScript('#page_content', "../src/appContent/adminContent/updateAppVersion.html", "../../appContent/adminContent/js/index.js", eventsUpdateAppVersion);
            insertElementHTML('#app', './appContent/adminContent/updateAppVersion.html', () => {
              eventsUpdateAppVersion(res.data(), appVersion)
            }, null, true);
          } else {
            importHTMLWithScript('#app', './appContent/adminContent/index.html', "../../appContent/adminContent/js/index.js");
            //Cerrega página principal da home
            // importHTMLWithScript('#page_content', "./components/home/index.html", "../home/js/index.js");
          };
        })
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  });

}

function eventsUpdateAppVersion(versionData, oldVersion) {
  let div = document.createElement('div')
  if (versionData.download === "") {
    div.innerHTML = `
    <p>Para atualizar da sua versão antiga: <span style='color:red'>${oldVersion} </span> para a nova versão: <b style='color:blue'>${versionData.version}</b></p>
    <p>
    utilize o link abaixo ou entre em contato com o administrador do sistema.</p>
    <br/>
    <a href='${versionData.download}'>Download</a></p>`;
  } else {
    div.innerHTML = `<br/>
    <p>Para atualizar da sua versão antiga: <span style='color:red'>${oldVersion} </span> para a nova versão: <b style='color:blue'>${versionData.version}</b></p>
      
    <p><b style='color:blue'>solicite o aplicativo atualizado com o administrador do sistema.</b></p>`;
  }
  document.querySelector("#update_app_content #update_message").insertAdjacentElement('beforeend', div);


}