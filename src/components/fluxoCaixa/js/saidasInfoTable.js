//-------------------------------------------------------------------
import * as commonFunc from "../../js_common/commonFunctions.js";
import * as dateFunc from "../../js_common/dateFunc.js";
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
                <td class='td_data'>${dateFunc.changeDateToDislayText(value.data)}</td>
                <td class='td_descricao'>${value.descricao}</td>
                <td class='td_tipo_saida'>${value.tipo_saida}</td>
                <td class='td_valor_total'>R$ ${value.valor}</td>
                `
                tr.innerHTML = trContent;
                tbody.appendChild(tr)
               }//if
            }
         
            let resEntradas = countEntradasTotal(mes, 'saida_avulsa');
            let resValorTotal = createValorTotalMes(mes,  'saida_avulsa');
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



function getFiltroInfoAnoMes(){
    let filtroInfo = {};
    let selectAno = document.querySelector('#select_ano');
    let selectMes = document.querySelector('#select_mes');
    filtroInfo.ano = selectAno.options[selectAno.selectedIndex].value;
    filtroInfo.mes = selectMes.options[selectMes.selectedIndex].value;
    return filtroInfo;
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


function insertContentTables( fluxoCaixaAno, mes){
        let contentTableSaidaAvulsa = createContentSaidaAvulsaTableHTML(fluxoCaixaAno, mes);
        insertContentTableSaidaAvulsaMensal(contentTableSaidaAvulsa);
        sortTbodyElementDate("#saida_avulsa_table_info");
        //-----------------------------------------

        let contentTableSaidasAvulsa = createContentSaidaAvulsaTableHTML(fluxoCaixaAno, mes);
        insertContentTableSaidasAvulsa(contentTableSaidasAvulsa);
        sortTbodyElementDate("#saida_avulsa_table_info");
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

async function setFluxoCaixaAno(ano){
    let fluxoCaixa =  getDoc(doc(db, 'fluxo_caixa', ano))
    .then((res)=>{
        $fluxoCaixaAno = res.data();
        $fluxoCaixaAno.ano = ano;
        return res.data();
    }).catch(err => console.log(err));
    return fluxoCaixa;
}
function countEntradasTotal(mes, categoria){
    let saidas = $fluxoCaixaAno[mes];
    let n_saidas = 0; 
    for(let value of Object.values(saidas)){
        if(value.categoria === categoria){
            n_saidas++; 
        }
    }
return n_saidas; 
}

function createValorTotalMes(mes, categoria){
let valorTotalMes = [];
    let saidas = $fluxoCaixaAno[mes];
    for(let value of Object.values(saidas)){
        if(value.categoria === categoria){
            if(value.valor_total){
                valorTotalMes.push(value.valor_total)
            }else{
                valorTotalMes.push(value.valor)
            }
        }
    }
    let res = valorTotalMes.reduce((acc, value)=>{
        let v = value.replace(',', '');
    return parseFloat(acc) + parseFloat(v);
}, 0)
  res = VMasker.toMoney(res);
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









