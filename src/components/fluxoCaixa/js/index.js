
import {insertEntradasSubpageHTML} from "./entradasSubpage.js"
import {insertSaidasSubpage} from "./saidasSubpage.js"

export function onload(){
    document.querySelector("#btn_entradas_caixa").addEventListener('click', ()=>{
        insertEntradasSubpageHTML();
    });
    document.querySelector("#btn_form_saida_caixa").addEventListener('click', ()=>{
        insertSaidasSubpage();
    });
   
    insertEntradasSubpageHTML();

}