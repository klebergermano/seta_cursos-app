import * as commonFunc from "../../js_common/commonFunctions.js";
import * as formAddContrato from "../js/formAddContrato.js"
import * as contratosInfoTable from "../js/contratosInfoTable.js"

export function eventsSubmenuPage(){
    document.querySelector('#btn_add_contrato').addEventListener('click', (e)=>{
        formAddContrato.insertFormAddContratoHTML();
    })  
    document.querySelector('#btn_contratos_info_table').addEventListener('click', (e)=>{
        contratosInfoTable.insertContratosInfoTable();
    })  


}