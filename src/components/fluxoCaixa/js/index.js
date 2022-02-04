
//---------------------------------------------------------------//
//Funções do componente
import { insertEntradasSubpageHTML } from "./entradasSubpage.js"
import { insertSaidasSubpage } from "./saidasSubpage.js"
import { insertResumoFluxoCaixaHTML } from "./resumoFluxoCaixa.js"
//---------------------------------------------------------------//

export function onload() {
    document.querySelector("#btn_resumo_fluxo_caixa").addEventListener('click', () => {
        insertResumoFluxoCaixaHTML();
    });
    document.querySelector("#btn_entradas_caixa").addEventListener('click', () => {
        insertEntradasSubpageHTML();
    });
    document.querySelector("#btn_form_saida_caixa").addEventListener('click', () => {
        insertSaidasSubpage();
    });
    insertResumoFluxoCaixaHTML();
}