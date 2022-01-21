const { ipcRenderer } = require("electron");

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
        console.log('click');
        ipcRenderer.send('maxRestoreApp')
});

//-----------------

import * as commonFunc from "./components/js_common/commonFunctions.js";

//Carrega a primeira página
commonFunc.importHTMLWithScript('#app', './components/login/index.html',"../login/js/index.js", ()=>{
        document.querySelector('#page_login').style.opacity = "1";
} )

