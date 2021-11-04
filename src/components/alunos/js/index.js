import * as alunosInfoTable from "../js/alunosInfoTable.js"
import * as submenuPage from "../js/submenuPage.js"
import * as commonFunc from "../../js_common/commonFunctions.js";



export function onload(){
   
    alunosInfoTable.inserAlunosInfoInTable()
    commonFunc.insertElementHTML("#bg_submenu_page", "./components/alunos/submenuPage.html",  submenuPage.eventsSubmenuPage, null, true)


}



