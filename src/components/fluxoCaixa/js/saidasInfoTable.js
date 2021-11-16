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
export function insertSaidasInfoTableHTML(){
    commonFunc.insertElementHTML('#saidas_content', './components/fluxoCaixa/saidasInfoTable.html', eventsSaidasInfoTable, null, true);
}
function eventsSaidasInfoTable(){
    setAnoMesSelectFiltros()
    let filtroInfo = getFiltroInfoAnoMes()
    setFluxoCaixaAno(filtroInfo.ano)
    .then((res)=>{
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
}

function insertContentTables(fluxoCaixaAno, mes){
    let contentTableSaidaAvulsa = createContentSaidaAvulsaTableHTML(fluxoCaixaAno, mes);
    insertContentTableSaidaAvulsaMensal(contentTableSaidaAvulsa);
    sortTbodyElementByDate("#saida_avulsa_table_info");
    //-----------------------------------------

    let contentTableSaidasAvulsa = createContentSaidaAvulsaTableHTML(fluxoCaixaAno, mes);
    insertContentTableSaidasAvulsa(contentTableSaidasAvulsa);
    sortTbodyElementByDate("#saida_avulsa_table_info");
    //-----------------------------------------

}

function insertContentTableSaidaAvulsaMensal(contentTable){
let table = document.querySelector('#saida_avulsa_table_info');
table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}
function insertContentTableSaidasAvulsa(contentTable){
let table = document.querySelector('#saida_avulsa_table_info');
table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}

  function createContentSaidaAvulsaTableHTML (fluxoCaixaAno, mes){
    
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let tbody = document.createElement('tbody'); 
    if(fluxoCaixaMes){
        for( let value of Object.values(fluxoCaixaMes)){
            if(value.categoria === "saida_avulsa"){
                let tr = document.createElement('tr');
                tr.id='tr_comum';
                let trContent = 
                `
                <td class='td_data'>${changeDateToDislayText(value.data)}</td>
                <td class='td_descricao'>${value.descricao}</td>
                <td class='td_tipo_saida'>${value.tipo_saida}</td>
                <td class='td_valor_total'>R$ ${value.valor}</td>
                `
                tr.innerHTML = trContent;
                tbody.appendChild(tr)
               }//if
            }

            let resEntradas = countEntradasTotal(fluxoCaixaAno, mes, 'saida_avulsa');
            let resValorTotal = somaValorTotalMes(fluxoCaixaAno, mes, 'saida_avulsa');


            //--------------------------------------
            let trResumo = document.createElement('tr');
            trResumo.id='tr_resumo';
            trResumo.innerHTML = `
            <td colspan='3'>Entradas: <span id='res_total_saida'>${resEntradas}</span></td>
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












