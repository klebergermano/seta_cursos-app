import { insertElementHTML } from "../../js_common/commonFunctions.js";
import {insertFluxoCaixaInfoInTableHTML} from "./fluxoCaixaInfoTable.js"
import {insertFormPagMensalidade} from "./formAddPagMensalidade.js"
import {insertFormAddEntradaAvulsa} from "./formAddEntradaAvulsa.js"
export function insertEntradasFluxoCaixaHTML(){
    insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/entradasFluxoCaixa.html", eventsEntradaFluxoCaixa, null, true)

}

function eventsEntradaFluxoCaixa(){
   insertFluxoCaixaInfoInTableHTML();
   
   document.querySelector("#btn_form_add_pag_mensalidade").addEventListener('click', ()=>{
    insertFormPagMensalidade();
});
   document.querySelector("#btn_form_add_entrada_avulsa").addEventListener('click', ()=>{
    insertFormAddEntradaAvulsa();
});
   document.querySelector("#btn_fluxo_caixa_info_table").addEventListener('click', ()=>{
    insertFluxoCaixaInfoInTableHTML();
});

}