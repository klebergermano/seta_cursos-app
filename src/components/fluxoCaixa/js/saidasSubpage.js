import { insertElementHTML } from "../../js_common/commonFunctions.js";
import { insertSaidasInfoTableHTML } from "./viewTableSaidasInfo.js";
import { insertFormAddSaidaAvulsa } from "./formAddSaidaAvulsa.js";
export function insertSaidasSubpage(){
    insertElementHTML("#fluxo_caixa_content", "./components/fluxoCaixa/saidasSubpage.html", eventsSaidasSubpage, null, true)
}

function eventsSaidasSubpage(){
   insertSaidasInfoTableHTML();
   document.querySelector("#btn_form_add_saida_avulsa").addEventListener('click', ()=>{
    insertFormAddSaidaAvulsa();
    });
    document.querySelector("#btn_saida_info_table").addEventListener('click', ()=>{
        insertSaidasInfoTableHTML();
    });
}