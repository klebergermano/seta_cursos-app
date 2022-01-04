//-------------------------------------------------------------------
import {confirmBoxDelete, insertElementHTML, createRadomIdLogBasedOnData} from "../../js_common/commonFunctions.js";
import {changeDateToDislayText} from "../../js_common/dateFunc.js";

import {countEntradasTotal, somaValorTotalMes, setFluxoCaixaAno, 
    setAnoMesSelectFiltros, sortTbodyElementByDate, 
    getFiltroInfoAnoMes} from "./commonFluxoCaixa.js";

//firebase
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDoc, doc, deleteField,setDoc, updateDoc} = require("firebase/firestore") 
const {getAuth} = require("firebase/auth");
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//Others libraries
const VMasker = require("vanilla-masker");
//--------------------------------------------------------------------
var $fluxoCaixaAno = {};
export function insertSaidasInfoTableHTML(){
    insertElementHTML('#saidas_content', './components/fluxoCaixa/viewTableSaidasInfo.html', eventsSaidasInfoTable, null, true);
}
function eventsSaidasInfoTable(){
    setAnoMesSelectFiltros()
    let filtroInfo = getFiltroInfoAnoMes()
    setFluxoCaixaAno(filtroInfo.ano)
    .then((res)=>{
        $fluxoCaixaAno = res; 
        $fluxoCaixaAno.ano = filtroInfo.ano;
        insertContentTables(res, filtroInfo.mes)
    }).then(()=>{
        btnsDeleteEntradaAvulsa()
    }).catch(err => console.log(err))

    document.querySelector("#select_ano").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        setFluxoCaixaAno(filtroInfo.ano)
        .then((res)=>{
            res.ano = filtroInfo.ano;
             insertContentTables(res, filtroInfo.mes)
        }).then(()=>{
            btnsDeleteEntradaAvulsa()
        }).catch(err => console.log(err))
     })
     document.querySelector("#select_mes").addEventListener('change', (e)=>{
        let filtroInfo = getFiltroInfoAnoMes()
        setFluxoCaixaAno(filtroInfo.ano)
.then((res)=>{
    res.ano =  filtroInfo.ano;
    insertContentTables(res, filtroInfo.mes)
}).then(()=>{
    btnsDeleteEntradaAvulsa()
})
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
        let saidas = false; 
        for( let value of Object.values(fluxoCaixaMes)){
            if(value?.categoria === "saida_avulsa"){
                saidas = true;
                let tr = document.createElement('tr');
                tr.id='tr_comum';
                tr.setAttribute('data-ano', fluxoCaixaAno.ano);
                tr.setAttribute('data-mes', mes);
                tr.setAttribute('data-row', value.row);
                let trContent = 
                `
                <td class='td_data'>${changeDateToDislayText(value.data)}</td>
                <td class='td_descricao'>${value.descricao}</td>
                <td class='td_tipo_saida'>${value.tipo_saida}</td>
                <td class='td_valor_total'>R$ ${value.valor}</td>
                <td  class='td_controls'>
                <button title="Deletar Pagamento" class='btn_delete_saida_avulsa'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </td>
                `
                tr.innerHTML = trContent;
                tbody.appendChild(tr)
               }//if
            }

            if(saidas){
                //-----------Resumo---------------------------
                let resEntradas = countEntradasTotal(fluxoCaixaAno, mes, 'saida_avulsa');
                let resValorTotal = somaValorTotalMes(fluxoCaixaAno, mes, 'saida_avulsa');
                let trResumo = document.createElement('tr');
                trResumo.id='tr_resumo';
                trResumo.innerHTML = `
                <td colspan='3'>Entradas: <span id='res_total_saida'>${resEntradas}</span></td>
                <td colspan='2' class="td_valor_total" id="td_res_valor_total">R$ ${resValorTotal}</td>
                `;
                tbody.appendChild(trResumo)
                //-----------------------------------------
            }else{
                let tr = document.createElement('tr')
                tr.innerHTML= `
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>R$ 0,00</td>
                <td>...</td>
                `;
                ;
                tbody.appendChild(tr)
            }
    
    }else{
        let tr = document.createElement('tr')
        tr.innerHTML= `
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>R$ 0,00</td>
        <td>...</td>
        `;
        ;
        tbody.appendChild(tr)
    }
       return tbody;
    }


    function btnsDeleteEntradaAvulsa(){
        let btnsPagMensal = document.querySelectorAll('#saida_avulsa_table_info .btn_delete_saida_avulsa');
        btnsPagMensal.forEach((item)=>{
            item.addEventListener('click', (e)=>{
                let tr = e.target.closest('tr');
                let data = tr.querySelector('.td_data').innerHTML;
                let valor = tr.querySelector('.td_valor_total').innerHTML;
                let descricao = tr.querySelector('.td_descricao').innerHTML;
                let ano = tr.dataset.ano; 
                let mes = tr.dataset.mes; 
                let row = tr.dataset.row; 
                let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
                <br/>Tem certeza que deseja deletar a saida de caixa "<b>${data} - ${descricao} - ${valor}</b>"?
                <br/>Essa ação não podera ser desfeita!`;
                confirmBoxDelete(".bg_tables", msg, ()=>{
                 submitDeleteSaidaAvulsa(ano, mes, row, data, valor, descricao); 
                })
            });
        });
    }


    function  submitDeleteSaidaAvulsa(ano, mes, row, data, valor, descricao){
        let string = `${mes}.${row}`;
        let deleteQuery = {};
        deleteQuery[string] = deleteField();
        const docAula = doc(db, 'fluxo_caixa', ano);
        updateDoc(docAula, deleteQuery)
        .then(()=>{ 
        let idLog = createRadomIdLogBasedOnData();
            setDoc(doc(db, "log", 'log_fluxo_caixa'),{
                [idLog]: `Deletado 'Saida de Fluxo de Caixa Avulsa' "${data} - R$${valor} - ${descricao}" deletado em ${new Date()} por ${auth.currentUser.email}`
                },
                { merge: true})
        })
        .then(()=>{
            insertSaidasInfoTableHTML();
        }).catch((err)=> console.log(err));
        }








