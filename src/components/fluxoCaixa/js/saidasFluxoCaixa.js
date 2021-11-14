import { insertElementHTML } from "../../js_common/commonFunctions.js";
import {insertFluxoCaixaInfoInTableHTML} from "./fluxoCaixaInfoTable.js"
import {insertFormPagMensalidade} from "./formAddPagMensalidade.js"
export function insertSaidasFluxoCaixaHTML(){
    insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/saidasFluxoCaixa.html", eventsSaidasFluxoCaixa, null, true)

}

function eventsSaidasFluxoCaixa(){
    /*
   insertFluxoCaixaInfoInTableHTML();
   
   document.querySelector("#btn_form_add_pag_mensalidade").addEventListener('click', ()=>{
    insertFormPagMensalidade();
});
   document.querySelector("#btn_fluxo_caixa_info_table").addEventListener('click', ()=>{
    insertFluxoCaixaInfoInTableHTML();
});
*/
}