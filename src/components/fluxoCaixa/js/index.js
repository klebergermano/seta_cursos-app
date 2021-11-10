import * as formAddPagMensalidade from "./formAddPagMensalidade.js"
import * as fluxoCaixaInfoTable from "./fluxoCaixaInfoTable.js"
export function onload(){
    document.querySelector("#btn_form_entrada_caixa").addEventListener('click', ()=>{
        formAddPagMensalidade.insertFormPagMensalidade();
        //formAddPagMensalidade.insertSelectAlunos();
    });
    document.querySelector("#btn_users_info_table").addEventListener('click', ()=>{
      console.log('click');
     fluxoCaixaInfoTable.insertFluxoCaixaInfoInTableHTML();
      //fluxoCaixaInfoTable.insertMenuFiltroTabela('#fluxo_caixa_content');
    });
    
    //-----------------------
  //  formAddPagMensalidade.insertFormPagMensalidade();
   // fluxoCaixaInfoTable.inserFluxoCaixaInfoInTable();
}