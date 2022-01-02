

import * as commonFunc from "./components/js_common/commonFunctions.js";

//Carrega a primeira página
commonFunc.importHTMLWithScript('#app', './components/login/index.html',"../login/js/index.js", ()=>{
        document.querySelector('#page_login').style.opacity = "1";
} )

