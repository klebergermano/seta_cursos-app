import * as formAddPagMensalidade from "./formAddPagMensalidade.js"
export function onload(){
    document.querySelector("#btn_form_entrada_caixa").addEventListener('click', ()=>{
        formAddPagMensalidade.insertFormPagMensalidade();
        //formAddPagMensalidade.insertSelectAlunos();
    });
    
    //-----------------------
    formAddPagMensalidade.insertFormPagMensalidade();

}