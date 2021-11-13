import * as formAddPagMensalidade from "./formAddPagMensalidade.js"
import * as fluxoCaixaInfoTable from "./fluxoCaixaInfoTable.js"
import {insertFormAddSaidaCaixa} from "./formAddSaidaCaixa.js"
export function onload(){
    document.querySelector("#btn_form_entrada_caixa").addEventListener('click', ()=>{
       // formAddPagMensalidade.insertFormPagMensalidade();
        //formAddPagMensalidade.insertSelectAlunos();
    });
    document.querySelector("#btn_form_saida_caixa").addEventListener('click', ()=>{
       // insertFormAddSaidaCaixa();
    });
   /*
    document.querySelector("#btn_fluxo_caixa_info_table").addEventListener('click', ()=>{
     fluxoCaixaInfoTable.insertFluxoCaixaInfoInTableHTML();
    });
    */
    //fluxoCaixaInfoTable.insertFluxoCaixaInfoInTableHTML();

}