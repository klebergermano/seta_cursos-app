//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, deleteField, updateDoc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import sortTable from "../../jsCommon/sortTable.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { confirmBoxDelete } from "../../jsCommon/confirmBoxFunc.js";
import { changeDateToDislayText } from "../../jsCommon/dateFunc.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//
//Funções do componente
import {
    countEntradasTotal, somaValorTotalMes, setFluxoCaixaAno, setAnoMesSelectFiltros, sortTbodyElementByDate,
    getFiltroInfoAnoMes
} from "./commonFluxoCaixa.js";
//---------------------------------------------------------------//
export function insertFluxoCaixaInfoInTableHTML() {
    insertElementHTML('#entradas_content', './components/fluxoCaixa/viewTableEntradasInfo.html', eventsEntradasInfoTable, null, true);
}

function eventsEntradasInfoTable() {
    setAnoMesSelectFiltros()
    let filtroInfo = getFiltroInfoAnoMes()
    setFluxoCaixaAno(filtroInfo.ano)
        .then((res) => {
            res.ano = filtroInfo.ano;
            insertContentTables(res, filtroInfo.mes)
        }).then(() => {
            btnsDeletePagMensal()
            btnsDeleteEntradaAvulsa()
        }).then(() => {
            eventsFilters()
        }).catch(err => console.log(err))

    document.querySelector("#select_ano").addEventListener('change', (e) => {
        let filtroInfo = getFiltroInfoAnoMes();
        setFluxoCaixaAno(filtroInfo.ano)
            .then((res) => {
                res.ano = filtroInfo.ano;
                insertContentTables(res, filtroInfo.mes)
            }).then(() => {
                btnsDeletePagMensal();
                btnsDeleteEntradaAvulsa();
            }).catch(err => console.log(err))
    })
    document.querySelector("#select_mes").addEventListener('change', (e) => {
        let filtroInfo = getFiltroInfoAnoMes();
        setFluxoCaixaAno(filtroInfo.ano)
            .then((res) => {
                res.ano = filtroInfo.ano;
                insertContentTables(res, filtroInfo.mes)
            }).then(() => {
                btnsDeletePagMensal();
                btnsDeleteEntradaAvulsa()
            }).catch(err => console.log(err))
    })

}

function eventsFilters() {

    let table = document.querySelector('#pag_mensal_table_info');
    table.querySelector('#pag_mensal_table_info #sort_data').addEventListener('click', (e) => {
        sortTable.sortByDate('#pag_mensal_table_info', '.td_data', e);
    })

    table.querySelector('#pag_mensal_table_info  #sort_ra').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#pag_mensal_table_info', '.td_ra', e);
    })

    table.querySelector('#pag_mensal_table_info  #sort_aluno').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#pag_mensal_table_info', '.td_aluno', e);
    })

    table.querySelector('#pag_mensal_table_info #sort_curso').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#pag_mensal_table_info', '.td_curso', e);
    })

    table.querySelector('#pag_mensal_table_info #sort_parcela').addEventListener('click', (e) => {
        sortTable.sortByIntTD('#pag_mensal_table_info', '.td_parcela', e);
    })

    table.querySelector('#pag_mensal_table_info #sort_form_pag').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#pag_mensal_table_info', '.td_form_pag', e);
    })


    //Inputs Search Table
    document.querySelector('#bg_entradas_info_table #input_search_aluno').addEventListener('input', (e) => {
        sortTable.filterTableByInputText('#pag_mensal_table_info', '.td_aluno', e);
    })


    //---Table Avulso----------------------------------------

    document.querySelector('#entrada_avulsa_table_info #sort_form_pag').addEventListener('click', (e) => {
        console.log('click2')
        sortTable.sortByTextTD('#entrada_avulsa_table_info', '.td_form_pag', e);
    })

    document.querySelector('#entrada_avulsa_table_info #sort_data').addEventListener('click', (e) => {
        console.log('click')
        sortTable.sortByTextTD('#entrada_avulsa_table_info', '.td_data', e);
    })
    //Inputs Search Table
    document.querySelector('#bg_entradas_info_table #input_search_desc').addEventListener('input', (e) => {
        sortTable.filterTableByInputText('#entrada_avulsa_table_info', '.td_descricao', e);
    })

}


function btnsDeleteEntradaAvulsa() {
    let btnsPagMensal = document.querySelectorAll('#entrada_avulsa_table_info .btn_delete_entrada_avulsa');
    btnsPagMensal.forEach((item) => {
        item.addEventListener('click', (e) => {
            let tr = e.target.closest('tr');
            let data = tr.querySelector('.td_data').innerHTML;
            let valor = tr.querySelector('.td_valor_total').innerHTML;
            let descricao = tr.querySelector('.td_descricao').innerHTML;
            let ano = tr.dataset.ano;
            let mes = tr.dataset.mes;
            let row = tr.dataset.row;
            let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
            <br/>Tem certeza que deseja deletar a entrada de caixa "<b>${data} - ${descricao} - ${valor}</b>"?
            <br/>Essa ação não podera ser desfeita!`;
            confirmBoxDelete(".bg_tables", msg, () => {
                submitDeleteEntradaAvulsa(ano, mes, row, data, valor, descricao);
            })
        });
    });
}
function btnsDeletePagMensal() {
    let btnsPagMensal = document.querySelectorAll('#pag_mensal_table_info .btn_delete_pag_mensal');
    btnsPagMensal.forEach((item) => {
        item.addEventListener('click', (e) => {
            let tr = e.target.closest('tr');
            let alunoNome = tr.querySelector('.td_aluno').innerHTML;
            let data = tr.querySelector('.td_data').innerHTML;
            let valor = tr.querySelector('.td_valor_total').innerHTML;
            let RA = tr.dataset.ra;
            let ano = tr.dataset.ano;
            let mes = tr.dataset.mes;
            let row = tr.dataset.row;
            let curso = tr.dataset.curso;
            let parcela = tr.dataset.parcela;
            let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
            <br/>Tem certeza que deseja deletar o Pagamento de Mensalidade: "<b> ${data} - ${RA} - ${alunoNome} - ${curso} - ${valor}"</b>?
            <br/>Essa ação não podera ser desfeita!`;
            confirmBoxDelete(".bg_tables", msg, () => {
                submitDeletePagMensal(ano, mes, row, RA, curso, parcela, data, valor);
            })
        });
    });
}

function insertContentTables(fluxoCaixaAno, mes) {
    let contentTablePagMensal = createContentPagMensalTableHTML(fluxoCaixaAno, mes);
    insertContentTablePagMensal(contentTablePagMensal);
    //sortTbodyElementByDate("#pag_mensal_table_info");
    //-----------------------------------------

    let contentTableEntradaAvulsa = createContentEntradaAvulsaTableHTML(fluxoCaixaAno, mes);
    insertContentTableEntradaAvulsa(contentTableEntradaAvulsa);
    //sortTbodyElementByDate("#entrada_avulsa_table_info");
    //-----------------------------------------
}


function insertContentTablePagMensal(contentTable) {
    let table = document.querySelector('#pag_mensal_table_info');
    table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}
function insertContentTableEntradaAvulsa(contentTable) {
    let table = document.querySelector('#entrada_avulsa_table_info');
    table.querySelector('#tbody').innerHTML = contentTable.innerHTML;
}
function createContentEntradaAvulsaTableHTML(fluxoCaixaAno, mes) {
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let tbody = document.createElement('tbody');
    if (fluxoCaixaMes) {
        let entradas = false;
        for (let value of Object.values(fluxoCaixaMes)) {
            if (value.categoria === "entrada_avulsa") {
                entradas = true;
                let tr = document.createElement('tr');
                tr.id = 'tr_comum';
                tr.setAttribute('data-ano', fluxoCaixaAno.ano);
                tr.setAttribute('data-mes', mes);
                tr.setAttribute('data-row', value.row);
                let trContent =
                    `
                <td class='td_data'>${changeDateToDislayText(value.data)}</td>
                <td class='td_descricao'>${value.descricao}</td>
                <td class='td_form_pag'>${value.form_pag}</td>
                <td class='td_valor_total'>${value.valor}</td>
                <td class='td_controls'>
                    <button title="Deletar Pagamento" class='btn_delete_entrada_avulsa'>
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

        if (entradas) {
            //----------Resumo----------------------------
            let resEntradas = countEntradasTotal(fluxoCaixaAno, mes, 'entrada_avulsa');
            let resValorTotal = somaValorTotalMes(fluxoCaixaAno, mes, 'entrada_avulsa');
            let trResumo = document.createElement('tr');
            trResumo.id = 'tr_resumo';
            trResumo.classList.add('sort_to_last_row');
            trResumo.innerHTML = `
         <td colspan='3'>Entradas: <span id='res_total_entradas'>${resEntradas}</span></td>
         <td colspan='2' class="td_valor_total" id="td_res_valor_total">${resValorTotal}</td>
         `;
            tbody.appendChild(trResumo)
            //---------------------
        } else {
            let tr = document.createElement('tr')
            tr.innerHTML = `
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>R$ 0,00</td>
                <td>...</td>
                `;
            ;
            tbody.appendChild(tr)
        }

    } else {
        let tr = document.createElement('tr')
        tr.innerHTML = `
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

function submitDeletePagMensal(ano, mes, row, RA, curso, parcela, data, valor) {
    let string = `${mes}.${row}`;
    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docAula = doc(db, 'fluxo_caixa', ano);
    updateDoc(docAula, deleteQuery)
        .then(() => {
            setDoc(doc(db, 'alunato', RA, 'cursos', curso), {
                curso_info: {
                    parcelas: {
                        [parcela]: {
                            pagamento: {
                                status: 'pendente',
                                pago_em: '',
                                obs: '',
                                form_pag: '',
                                metadata: {
                                    modified: new Date(),
                                }
                            }
                        }
                    }
                }
            }, { merge: true }
            );
        })
        .then(() => {
            insertFluxoCaixaInfoInTableHTML();
        }).then(() => {
            addLogInfo('log_fluxo_caixa', 'delete', `pag_mensalidade -"${RA} - ${parcela} - R$${valor}"`);
        }).catch((error) => {
            addLogInfo('log_fluxo_caixa', 'error', 'pag_mensalidade', error);
        });
}

function submitDeleteEntradaAvulsa(ano, mes, row, data, valor, descricao) {
    let string = `${mes}.${row}`;

    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docAula = doc(db, 'fluxo_caixa', ano);
    updateDoc(docAula, deleteQuery)
        .then(() => {
            insertFluxoCaixaInfoInTableHTML();
        }).then(() => {
            addLogInfo('log_fluxo_caixa', 'delete', `entrada_avulsa -"${descricao} - R$${valor}"`);
        }).catch((error) => {
            addLogInfo('log_fluxo_caixa', 'error', 'entrada_avulsa', error);
        });
}

function createContentPagMensalTableHTML(fluxoCaixaAno, mes) {
    let fluxoCaixaMes = fluxoCaixaAno?.[mes];
    let tbody = document.createElement('tbody');
    if (fluxoCaixaMes) {
        let entradas = false;
        for (let value of Object.values(fluxoCaixaMes)) {
            if (value.categoria === "pag_mensalidade") {
                entradas = true;
                let tr = document.createElement('tr');

                tr.id = 'tr_comum';
                tr.setAttribute('data-ano', fluxoCaixaAno.ano);
                tr.setAttribute('data-mes', mes);
                tr.setAttribute('data-row', value.row);
                tr.setAttribute('data-ra', value.ra);
                tr.setAttribute('data-curso', value.curso);
                tr.setAttribute('data-parcela', value.parcela);
                let trContent =
                    `
                <td class='td_data'>${changeDateToDislayText(value.data)}</td>
                <td class='td_ra'>${value.ra}</td>
                <td class='td_aluno'>${value.aluno}</td>
                <td class='td_curso'>${value.curso}</td>
                <td class='td_parcela'>${value.parcela}</td>
                <td class='td_form_pag'>${value.form_pag}</td>
                <td class='td_obs'><textarea readonly='true'>${value.obs}</textarea></td>

                <td class='td_valor_total'>${value.valor_total}</td>
                <td  class='td_controls'>
                <button title="Deletar Pagamento" class='btn_delete_pag_mensal'>
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

        if (entradas) {
            //--------------------------------------
            let resEntradas = countEntradasTotal(fluxoCaixaAno, mes, 'pag_mensalidade');
            let resValorTotal = somaValorTotalMes(fluxoCaixaAno, mes, 'pag_mensalidade');

            let trResumo = document.createElement('tr');
            trResumo.id = 'tr_resumo';
            trResumo.classList.add('sort_to_last_row');
            trResumo.innerHTML = `
            <td colspan='7'>Entradas: <span id='res_total_entradas'>${resEntradas}</span></td>
            <td colspan='2' class="td_valor_total" id="td_res_valor_total">${resValorTotal}</td>
            `;
            tbody.appendChild(trResumo)
        } else {
            let tr = document.createElement('tr')
            tr.innerHTML = `
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>R$ 0,00</td>
                <td>...</td>
                `;
            ;
            tbody.appendChild(tr)
        }
    } else {
        let tr = document.createElement('tr')
        tr.innerHTML = `
        <td>...</td>
        <td>...</td>
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
