const {initializeApp} = require("firebase/app") 
const {getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} =  require("firebase/auth");
const {getFirestore, collection, getDocs, doc, getDoc} = require("firebase/firestore") 

const firebaseConfig = {
  apiKey: "AIzaSyCQ0IIED6S4yHGwd4iePApe3IDmrVW6-Cs",
  authDomain: "seta-cursos-app.firebaseapp.com",
  projectId: "seta-cursos-app",
  storageBucket: "seta-cursos-app.appspot.com",
  messagingSenderId: "604551662801",
  appId: "1:604551662801:web:617516e76e3f23ce35c9f0",
  measurementId: "G-MB10BFHBQ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
let email = "kleber_lsgermano@hotmail.com";
let password = "teste123";
const db = getFirestore(app);


//LOGIN USER

signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Signed in 
  const user = userCredential.user;
  console.log('logado', user);
  // ...
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
console.log(errorCode, errorMessage);

});
//----------



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

    let childs = document.querySelector('#main_menu_lateral').querySelectorAll("a");
    childs.forEach((item) => {
      item.addEventListener("click", (e) => {
         let scriptSRC = './components/'+ e.target.dataset.script_src + '/js/index.js'; 
        let htmlSRC = './components/'+ e.target.dataset.path + '/index.html'; 
        importHTML('#page_content', htmlSRC, scriptSRC);
      });
    });

//Carrega a primeira página
importHTML('#page_content', './components/controle_aula/index.html',"./components/controle_aula/js/index.js" )

