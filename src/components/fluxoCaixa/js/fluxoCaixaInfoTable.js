var $fluxoCaixaAno = {};

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection, getDoc, doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dateFunc from "../../js_common/dateFunc.js";
export function insertFluxoCaixaInfoInTableHTML(){
    commonFunc.insertElementHTML('#fluxo_caixa_content', './components/fluxoCaixa/infoTablePagMensal.html', eventsInfoTable, null, true);
}

function setAnoMesAtual(){
    return 
}

function setAnoMesSelectFiltros(){
    let date = new Date();
    let mes = parseInt(date.getMonth()) + 1;
    let ano = date.getFullYear();
    let optionsSelectAno = Array.from(document.querySelector('#select_ano').options);
    let optionsSelectMes = Array.from(document.querySelector('#select_mes').options);
    optionsSelectAno.forEach((optAno)=>{
      if(optAno.value === ano){
        optAno.setAttribute('selected', true);
      }
    });
    optionsSelectMes.forEach((optMes)=>{
        let mesExtenso = dateFunc.converteMesNumeroPorExtenso(mes);
      if(optMes.value === mesExtenso){
        optMes.setAttribute('selected', true);
      }
    });
}
function eventsInfoTable(){
    setAnoMesSelectFiltros()
    let filtroInfo = getFiltroInfoAnoMes()

    setFluxoCaixaAno(filtroInfo.ano)
    .then((res)=>{
        infoTableContent(res, filtroInfo.mes)
    }).catch(err => console.log(err))

    document.querySelector("#select_ano").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        setFluxoCaixaAno(filtroInfo.ano)
        .then(()=>{
            infoTableContent($fluxoCaixaAno, filtroInfo.mes)
        }).catch(err => console.log(err))
     })
     document.querySelector("#select_mes").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        infoTableContent($fluxoCaixaAno, filtroInfo.mes)
     })
}

function infoTableContent( fluxoCaixaAno, mes){
        let contentTable = createContentInfoTableHTML(fluxoCaixaAno, mes);
        insertContentTable(contentTable)
}

function insertContentTable(contentTable){
   let table = document.querySelector('#pag_mensal_table_info');
   table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}

async function setFluxoCaixaAno(ano){
    let fluxoCaixa =  getDoc(doc(db, 'fluxo_caixa', ano))
    .then((res)=>{
        $fluxoCaixaAno = res.data();
        $fluxoCaixaAno.ano = ano;
        return res.data();
    }).catch(err => console.log(err));
    return fluxoCaixa;
}


function createContentInfoTableHTML (fluxoCaixaAno, mes){
   
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let bgTr = document.createElement('tbody'); 

    if(fluxoCaixaMes){
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
    }else{
        let tr = document.createElement('tr')
        tr.innerHTML= `
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>`;
        ;
        bgTr.appendChild(tr)

    }
       return bgTr;
    }


function getFiltroInfoAnoMes(){
    let filtroInfo = {};
    let selectAno = document.querySelector('#select_ano');
    let selectMes = document.querySelector('#select_mes');
    filtroInfo.ano = selectAno.options[selectAno.selectedIndex].value;
    filtroInfo.mes = selectMes.options[selectMes.selectedIndex].value;
    return filtroInfo;
}














