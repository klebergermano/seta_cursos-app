var $fluxoCaixaAno = {};

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection, getDoc, doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dateFunc from "../../js_common/dateFunc.js";
export function insertFluxoCaixaInfoInTableHTML(){
    commonFunc.insertElementHTML('#fluxo_caixa_content', './components/fluxoCaixa/infoTablePagMensal.html', eventsInfoTable, null, true);
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
        insertContentTable(contentTable);
        sortTbodyElementDate("#pag_mensal_table_info");
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
function countEntradasTotal(mes){
    let entradas = $fluxoCaixaAno[mes];
    let n_entradas = 0; 
    for(let value of Object.values(entradas)){
        if(value.categoria === 'pag_mensalidade'){
            n_entradas++; 

        }

    }

return n_entradas; 
}

function createValorTotalMes(mes){
let valorTotalMes = [];
    let entradas = $fluxoCaixaAno[mes];
    for(let value of Object.values(entradas)){
        if(value.categoria === 'pag_mensalidade'){
            valorTotalMes.push(value.valor_total)

        }
    }
    let res = valorTotalMes.reduce((acc, value)=>{
    return parseInt(acc) + parseInt(value);
})
return res; 
}

function sortTbodyElementDate(tableID) {
    let tbody = document.querySelector(`${tableID} tbody`);
    let rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort(function (a, b) {
        if(a.id !== 'tr_resumo'){
      return (
        convertDateToNumber(a.querySelector('.td_data').innerHTML) -
        convertDateToNumber(b.querySelector('.td_data').innerHTML)
      );
    }
    });
    tbody.innerHTML = ''; 
    rows.forEach((item) => {
        tbody.appendChild(item);
    });
  }
  
  function convertDateToNumber(d) {
    var p = d.split("/");
    return +(p[2] + p[1] + p[0]);
  }

function createContentInfoTableHTML (fluxoCaixaAno, mes){
   
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let bgTr = document.createElement('tbody'); 

    if(fluxoCaixaMes){
        let i = 1; 
        for( let [key, value] of Object.entries(fluxoCaixaMes)){
            if(value.categoria === "pag_mensalidade"){
                let tr = document.createElement('tr');
                tr.id='tr_comum';
                let trContent = 
                `
                <td class='td_data'>${dateFunc.changeDateToDislayText(value.data)}</td>
                <td class='td_aluno'>${value.aluno}</td>
                <td class='td_curso'>${value.curso}</td>
                <td class='td_parcela'>${value.parcela}</td>
                <td class='td_form_pag'>${value.form_pag}</td>
                <td class='td_valor_total'>R$ ${value.valor_total}</td>
                `
                tr.innerHTML = trContent;
                bgTr.appendChild(tr)
                i++;
               }//if
            }
         
            let resEntradas = countEntradasTotal(mes);
            let resValorTotal = createValorTotalMes(mes);
            //--------------------------------------
            let trResumo = document.createElement('tr');
            trResumo.id='tr_resumo';
            trResumo.innerHTML = `
            <td colspan='5'>Entradas: <span id='res_total_entradas'>${resEntradas}</span></td>
            <td colspan='1' class="td_valor_total" id="td_res_valor_total">R$ ${resValorTotal}</td>
            `;
            bgTr.appendChild(trResumo)
            setTimeout(()=>{
                let x = document.querySelector('#tr_resumo');
                console.log(x);

            }, 500)
            

    }else{
        let tr = document.createElement('tr')
        tr.innerHTML= `
        
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














