import * as formAddPagMensalidade from "./formAddPagMensalidade.js"
import * as fluxoCaixaInfoTable from "./fluxoCaixaInfoTable.js"
export function onload(){
    document.querySelector("#btn_form_entrada_caixa").addEventListener('click', ()=>{
        formAddPagMensalidade.insertFormPagMensalidade();
        //formAddPagMensalidade.insertSelectAlunos();
    });
    document.querySelector("#btn_users_info_table").addEventListener('click', ()=>{
     fluxoCaixaInfoTable.insertFluxoCaixaInfoInTableHTML();
    });
    fluxoCaixaInfoTable.insertFluxoCaixaInfoInTableHTML();

}