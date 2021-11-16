//-------------------------------------------------------------------
import * as commonFunc from "../../js_common/commonFunctions.js";
import {changeDateToDislayText} from "../../js_common/dateFunc.js";
import {countEntradasTotal, somaValorTotalMes, setFluxoCaixaAno, 
        setAnoMesSelectFiltros, sortTbodyElementByDate, 
        getFiltroInfoAnoMes} from "./commonFluxoCaixa.js";

//firebase
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDoc, doc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

//Others libraries
const VMasker = require("vanilla-masker");

//--------------------------------------------------------------------
var $fluxoCaixaAno = {};

export function insertFluxoCaixaInfoInTableHTML(){
    commonFunc.insertElementHTML('#entradas_content', './components/fluxoCaixa/entradasInfoTable.html', eventsEntradasInfoTable, null, true);
}

function setMasks() {
   //VMasker(document.querySelector('.td_valor_total')).maskMoney();
  }
  
function eventsEntradasInfoTable(){
    setAnoMesSelectFiltros()
    let filtroInfo = getFiltroInfoAnoMes()
    setFluxoCaixaAno(filtroInfo.ano)
    .then((res)=>{
        $fluxoCaixaAno = res;
        $fluxoCaixaAno.ano = filtroInfo.ano;
        insertContentTables(res, filtroInfo.mes)
    }).catch(err => console.log(err))

    document.querySelector("#select_ano").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        setFluxoCaixaAno(filtroInfo.ano)
        .then(()=>{
            insertContentTables($fluxoCaixaAno, filtroInfo.mes)
        }).catch(err => console.log(err))
     })
     document.querySelector("#select_mes").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        insertContentTables($fluxoCaixaAno, filtroInfo.mes)
     })
     setMasks() 
}

function insertContentTables( fluxoCaixaAno, mes){
        let contentTablePagMensal = createContentPagMensalTableHTML(fluxoCaixaAno, mes);
        insertContentTablePagMensal(contentTablePagMensal);
        sortTbodyElementByDate("#pag_mensal_table_info");
        //-----------------------------------------

        let contentTableEntradaAvulsa = createContentEntradaAvulsaTableHTML(fluxoCaixaAno, mes);
        insertContentTableEntradaAvulsa(contentTableEntradaAvulsa);
        sortTbodyElementByDate("#entrada_avulsa_table_info");
        //-----------------------------------------
}

function insertContentTablePagMensal(contentTable){
   let table = document.querySelector('#pag_mensal_table_info');
   table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}
function insertContentTableEntradaAvulsa(contentTable){
   let table = document.querySelector('#entrada_avulsa_table_info');
   table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}
  function createContentEntradaAvulsaTableHTML (fluxoCaixaAno, mes){
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let tbody = document.createElement('tbody'); 
    if(fluxoCaixaMes){
        for( let value of Object.values(fluxoCaixaMes)){
            if(value.categoria === "entrada_avulsa"){
                let tr = document.createElement('tr');
                tr.id='tr_comum';
                let trContent = 
                `
                <td class='td_data'>${changeDateToDislayText(value.data)}</td>
                <td class='td_descricao'>${value.descricao}</td>
                <td class='td_form_pag'>${value.form_pag}</td>
                <td class='td_valor_total'>R$ ${value.valor}</td>
                `
                tr.innerHTML = trContent;
                tbody.appendChild(tr)
               }//if
            }
         
            let resEntradas = countEntradasTotal(fluxoCaixaAno, mes, 'entrada_avulsa');
            let resValorTotal = somaValorTotalMes(fluxoCaixaAno, mes,  'entrada_avulsa');
            //--------------------------------------
            let trResumo = document.createElement('tr');
            trResumo.id='tr_resumo';
            trResumo.innerHTML = `
            <td colspan='3'>Entradas: <span id='res_total_entradas'>${resEntradas}</span></td>
            <td colspan='1' class="td_valor_total" id="td_res_valor_total">R$ ${resValorTotal}</td>
            `;
            tbody.appendChild(trResumo)
    }else{
        let tr = document.createElement('tr')
        tr.innerHTML= `
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>R$ 0,00</td>`;
        ;
        tbody.appendChild(tr)
    }
       return tbody;
    }

function createContentPagMensalTableHTML (fluxoCaixaAno, mes){
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let tbody = document.createElement('tbody'); 
    if(fluxoCaixaMes){
        for( let value of Object.values(fluxoCaixaMes)){
            if(value.categoria === "pag_mensalidade"){
                let tr = document.createElement('tr');
                tr.id='tr_comum';
                let trContent = 
                `
                <td class='td_data'>${changeDateToDislayText(value.data)}</td>
                <td class='td_aluno'>${value.aluno}</td>
                <td class='td_curso'>${value.curso}</td>
                <td class='td_parcela'>${value.parcela}</td>
                <td class='td_form_pag'>${value.form_pag}</td>
                <td class='td_valor_total'>R$ ${value.valor_total}</td>
                `
                tr.innerHTML = trContent;
                tbody.appendChild(tr)
               }//if
            }
         
            let resEntradas = countEntradasTotal( $fluxoCaixaAno, mes, 'pag_mensalidade');
            let resValorTotal = somaValorTotalMes($fluxoCaixaAno, mes, 'pag_mensalidade');
            //--------------------------------------
            let trResumo = document.createElement('tr');
            trResumo.id='tr_resumo';
            trResumo.innerHTML = `
            <td colspan='5'>Entradas: <span id='res_total_entradas'>${resEntradas}</span></td>
            <td colspan='1' class="td_valor_total" id="td_res_valor_total">R$ ${resValorTotal}</td>
            `;
            tbody.appendChild(trResumo)
    }else{
        let tr = document.createElement('tr')
        tr.innerHTML= `
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>R$ 0,00</td>`;
        ;
        tbody.appendChild(tr)
    }
       return tbody;
    }

















