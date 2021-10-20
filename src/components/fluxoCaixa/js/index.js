import * as formAddEntradaCaixa from "./formAddEntradaCaixa.js"
export function onload(){
    document.querySelector("#btn_form_entrada_caixa").addEventListener('click', ()=>{
        formAddEntradaCaixa.insertFormEntradaCaixa();
    });
    console.log('Fluxo Caixa');
    

}