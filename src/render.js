//Electron
const { ipcRenderer } = require("electron");
//---------------------------------------------------------------//
//Components
import importHTMLWithScript from "./components/jsCommon/importHTMLWithScript.js";
//---------------------------------------------------------------//



//Window Bar Events
btn_close_app.addEventListener('click', ()=>{
        ipcRenderer.send('closeApp')
});

//Window Bar Events
btn_minimize_window.addEventListener('click', ()=>{
        ipcRenderer.send('minimizeApp')
});

//Window Bar Events
btn_max_restore_window.addEventListener('click', ()=>{
        ipcRenderer.send('maxRestoreApp')
});

//Carrega a primeira página
importHTMLWithScript('#app', './components/login/index.html',"../login/js/index.js", ()=>{
        document.querySelector('#page_login').style.opacity = "1";
} )

