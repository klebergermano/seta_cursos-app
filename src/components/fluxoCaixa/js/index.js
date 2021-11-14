
import {insertEntradasFluxoCaixaHTML} from "./entradasFluxoCaixa.js"
import {insertSaidasFluxoCaixaHTML} from "./saidasFluxoCaixa.js"

export function onload(){
    document.querySelector("#btn_entradas_caixa").addEventListener('click', ()=>{
        insertEntradasFluxoCaixaHTML();
    });
    document.querySelector("#btn_form_saida_caixa").addEventListener('click', ()=>{
        insertSaidasFluxoCaixaHTML();
    });
   
    insertEntradasFluxoCaixaHTML();

}