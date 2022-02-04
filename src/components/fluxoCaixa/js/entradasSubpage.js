//Components
import { insertElementHTML } from "../../jsCommon/commonFunctions.js";
import { insertFluxoCaixaInfoInTableHTML } from "./viewTableEntradasInfo.js"
import { insertFormPagMensalidade } from "./formAddPagMensalidade.js"
import { insertFormAddEntradaAvulsa } from "./formAddEntradaAvulsa.js"
//---------------------------------------------------------------//

export function insertEntradasSubpageHTML() {
    insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/entradasSubpage.html", eventsEntradasSubpage, null, true)
}

function eventsEntradasSubpage() {
    insertFluxoCaixaInfoInTableHTML();
    document.querySelector("#btn_form_add_pag_mensalidade").addEventListener('click', () => {
        insertFormPagMensalidade();
    });
    document.querySelector("#btn_form_add_entrada_avulsa").addEventListener('click', () => {
        insertFormAddEntradaAvulsa();
    });
    document.querySelector("#btn_fluxo_caixa_info_table").addEventListener('click', () => {
        insertFluxoCaixaInfoInTableHTML();
    });
}