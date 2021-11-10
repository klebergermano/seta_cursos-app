var $fluxoCaixaAno = {};

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection, getDoc, doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";




export function insertFluxoCaixaInfoInTableHTML(){
    commonFunc.insertElementHTML('#fluxo_caixa_content', './components/fluxoCaixa/infoTablePagMensal.html', eventsInfoTable, null, true);

}


function eventsInfoTable(){
    infoTableContent('2021', 'novembro');
    document.querySelector("#select_ano").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        infoTableContent( filtroInfo.ano, filtroInfo.mes)
     })
     document.querySelector("#select_mes").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        infoTableContent( filtroInfo.ano, filtroInfo.mes)
     })
}


function infoTableContent(ano, mes){
    getFluxoCaixaAno(ano)
    .then((res)=>{
        let contentTable = createContentInfoTableHTML(res, mes);
        return contentTable;
    }).then((contentTable)=>{
        let table = document.querySelector('#pag_mensal_table_info');
        table.removeChild(table.querySelector('tbody'));

        return contentTable;
    })
    .then((contentTable)=>{
        insertContentTable(contentTable)
    })
}
function insertContentTable(contentTable){
    console.log(contentTable);
   let table = document.querySelector('#pag_mensal_table_info');
   table.appendChild(contentTable);

}

function createContentInfoTableHTML (resfluxoCaixaAno, mes){

    let fluxoCaixaMes = resfluxoCaixaAno.data()[mes];
    let bgTr = document.querySelector('tbody'); 
for( let [key, value] of Object.entries(fluxoCaixaMes)){
    let tr = document.createElement('tr');
    let trContent = 
    `
    <td class='linha'>${key}</td>
    <td>${value.data}</td>
    <td>${value.aluno}</td>
    <td>${value.curso}</td>
    <td>${value.parcela}</td>
    <td>${value.form_pag}</td>
    <td>${value.valor_total}</td>
    `
    tr.innerHTML = trContent;
    bgTr.appendChild(tr)
    }
       return bgTr;
      
    }









function removeMenuFiltroTable(){
    let menuFiltro = document.querySelectorAll('.menu_info_table')
    menuFiltro.forEach((menu)=>{
        let parent = menu.parentElement;
        parent.removeChild(menu);
    })
}
export function insertMenuFiltroTabela(idTarget){
    removeMenuFiltroTable()
    document.querySelector(idTarget).insertAdjacentElement('beforebegin', menuFiltroTabela());
    
}

function getFiltroInfoAnoMes(){
    let filtroInfo = {};
    let selectAno = document.querySelector('#select_ano');
    let selectMes = document.querySelector('#select_mes');
    filtroInfo.ano = selectAno.options[selectAno.selectedIndex].value;
    filtroInfo.mes = selectMes.options[selectMes.selectedIndex].value;
    return filtroInfo;
}


export function insertFluxoCaixaInfoInTableX(ano, mes){
    getFluxoCaixaAno(ano)
    .then((res) => {
        return createTableFluxoCaixaHTML(res, mes)
    })
    .then((tableFluxoCaixaHTML)=>{
       document.querySelector('#fluxo_caixa_content').innerHTML = ""; 
       document.querySelector('#fluxo_caixa_content').appendChild(tableFluxoCaixaHTML);
    })
    .catch(err => console.log(err))
  
}



    function getFluxoCaixaAno(ano){
        let fluxoCaixaAno = getDoc(doc(db, 'fluxo_caixa', ano));
        return fluxoCaixaAno;
    }










