
import * as contratosInfoTable from "../js/contratosInfoTable.js"
import * as submenuPage from "../js/submenuPage.js"
import * as commonFunc from "../../js_common/commonFunctions.js";

export function onload(){

  commonFunc.displaySpinnerLoad("#page_content")
  contratosInfoTable.insertContratosInfoTable()
  .then(()=>{
    commonFunc.removeSpinnerLoad("#page_content")
  })
  commonFunc.insertElementHTML("#bg_submenu_page", "./components/contratos/submenuPage.html",  submenuPage.eventsSubmenuPage, null, true)
}