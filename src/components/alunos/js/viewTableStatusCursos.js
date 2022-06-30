
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection, where, deleteDoc, query, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import sortTable from "../../jsCommon/sortTable.js";
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { insertInfoAlunoHTML } from "./infoAluno.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//Other libraries
const VMasker = require("vanilla-masker");
//---------------------------------------------------------------//

//=========================================================================
//TODO: Refatorar e comentar.
//=========================================================================


let $GLOBAL_CURSOS_LISTA = {}

// Insere o centúdo da página.
export function insertViewTableStatusCursosHTML() {
    insertElementHTML("#alunos_content", "./components/alunos/viewTableStatusCursos.html", eventsInserViewTableAlunos, null, true)
}

// Retorna a lista de alunos do db.
function getAlunosList() {
    let alunatoList = getDocs(query(collection(db, 'alunato'), where('aluno', '!=', 'undefined')))
    return alunatoList;
}

// Insere o conteúdo da tabela de cursos.
function insertContentCursosTable(filtro, arrListCursos){
    let tbodyCursos = createTableCursosHTML(filtro, arrListCursos);
    document.querySelector('#view_table_status_cursos tbody').innerHTML = tbodyCursos.innerHTML;
}
// Carrega todos os eventos da página.
export async function eventsInserViewTableAlunos(){
    //Cria a lista completa com os alunos e seus cursos.
    listaCompletaAlunosCursos()
        .then((res) => {
            // Seta a variável global com a lista de cursos.
            $GLOBAL_CURSOS_LISTA = createArrayListCursos(res);

            // Variável com o valor atual do select de status de curso. 
            let filtroSelectValue = getSelectStatusValue();

            // Insere o conteúdo da tabela.
            insertContentCursosTable(filtroSelectValue, $GLOBAL_CURSOS_LISTA);
        }).then(() => {
            eventsButtonsInfoTableAlunos(); 
            eventsFilters();
            insertResumoCursos();
        }).catch((error)=> console.log(error));
}

//Pega o valor atual do select de status.
function getSelectStatusValue(){
    let selectFiltroStatus = document.querySelector('#select_status_cursos');
    let filtroSelectValue = selectFiltroStatus.options[selectFiltroStatus.options.selectedIndex].value;
    return filtroSelectValue;
}


// Retorna o valor da parcela do curso caso o curso esteja ativo.
function getValorCursoAtivo(item){
    let valorTotal = '0'; 
   if(item?.status_info?.situacao === 'ativo'){
    valorTotal = item.curso_info.valor_total_mes;
   }
   return valorTotal;
}

function convertValorStringToInteger(valorString){
    //remove a virgula e converte para inteiro.
    return parseInt(valorString.replace(/,/g, ''));

}
// Retorna um objeto com as informações em resumo dos cursos.
function getResumoCursos(){
    // Objecto com o resumo de cursos com o campos esperados ja inseridos.
    let resumo_cursos = {
        media_valor_cursos_ativos: 0, 
        valor_total_cursos_ativos: 0, 
        qtd_curso_ativo: 0, 
        qtd_curso_pausado: 0, 
        qtd_curso_concluido: 0, 
        qtd_curso_cancelado: 0,  
        qtd_curso_cadastrado: 0 
    }

    //forEach da variável global com a lista dos cursos.
    $GLOBAL_CURSOS_LISTA.forEach((item)=>{
        // Some um novo curso para cada item.
        resumo_cursos.qtd_curso_cadastrado ++; 
        // Status do curso.
        let c_status = item?.status_info?.situacao;
        // Soma o valor em integer dos cursos caso esse esteja ativo.
        resumo_cursos.valor_total_cursos_ativos += convertValorStringToInteger(getValorCursoAtivo(item)); 
        // Soma a quantidade de cursos com cada status encontrado.
        if(!resumo_cursos['qtd_curso_'+ c_status]){
            //Caso o status não exista cria um novo status e adiciona 1.
            resumo_cursos['qtd_curso_'+ c_status] = 1; 
        }else{
            // Adiciona +1 no qtd do status.
            resumo_cursos['qtd_curso_'+ c_status] ++; 
        }
    })
    // Insere o valor da média dos cursos em "resumo_cursos". 
    resumo_cursos.media_valor_cursos_ativos = getMediaValor( resumo_cursos.valor_total_cursos_ativos, resumo_cursos.qtd_curso_ativo);
    // Formata o "valor_total_cursos_ativos" para o formato de string decimal.
    resumo_cursos.valor_total_cursos_ativos = VMasker.toMoney( resumo_cursos.valor_total_cursos_ativos, { showSignal: true });

    console.log(resumo_cursos)
    return resumo_cursos; 
}

// Gera o valor médio dividindo uma soma inteira e a quantidade, retornando uma string decimal.
function getMediaValor(valorInt, qtd){
    let valorMedioInt = parseInt(valorInt / qtd);
    let valorMedioFormatado = VMasker.toMoney(valorMedioInt, { showSignal: true });
    return valorMedioFormatado;
}

// Insere as informações em HTML do resumo de cursos.
function insertResumoCursos(){
   let resumoCursosObj =  getResumoCursos();
   let resumoCursosElement = document.querySelector('#resumo_cursos');
   resumoCursosElement.innerHTML = `
    <div class='resumo_ativos'>
        <p>Ativos: ${resumoCursosObj.qtd_curso_ativo}</p> 
        <p>Previsto: <span class='total'>R$ ${resumoCursosObj.valor_total_cursos_ativos}</span></p>
        <p>Média p/ curso: R$ ${resumoCursosObj.media_valor_cursos_ativos}</p>
    </div>
    <div><p>Pausados: ${resumoCursosObj.qtd_curso_pausado}</p></div>
    <div><p>Cancelado: ${resumoCursosObj.qtd_curso_cancelado}</p></div>
    <div><p>Concluidos: ${resumoCursosObj.qtd_curso_concluido}</p></div>
    <div><p>Cadastrados: ${resumoCursosObj.qtd_curso_cadastrado}</p></div>
   `; 
}

// Carrega os eventos de filtro da tabela.
function eventsFilters(){
    let table = document.querySelector('#view_table_status_cursos');
    document.querySelector('#select_status_cursos').addEventListener('change', (e) => {
        let filtro = e.target.value; 
        insertContentCursosTable(filtro, $GLOBAL_CURSOS_LISTA);
        eventsButtonsInfoTableAlunos(); 
    })
    table.querySelector('#sort_status').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#view_table_status_cursos', '.td_status', e);
    })
    table.querySelector('#sort_ra').addEventListener('click', (e) => {
        sortTable.sortByIntTD('#view_table_status_cursos', '.td_ra', e);
    })
    table.querySelector('#sort_aluno').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#view_table_status_cursos', '.td_nome', e);
    })
    table.querySelector('#sort_curso').addEventListener('click', (e) => {
        sortTable.sortByTextTD('#view_table_status_cursos', '.td_curso', e);
    })
      document.querySelector('#bg_view_table_status_cursos #input_search_aluno').addEventListener('input', (e) => {
        sortTable.filterTableByInputText('#view_table_status_cursos', '.td_nome', e);
    })
    document.querySelector('#bg_view_table_status_cursos #input_search_curso').addEventListener('input', (e) => {
        sortTable.filterTableByInputText('#view_table_status_cursos', '.td_curso', e);
    })
}

// Retornando um objeto com o aluno e os cursos associados.
async function getCusosAluno(aluno) {
    let cursosList = await getDocs(collection(db, 'alunato', aluno.ra, 'cursos'))
        .then((res) => {
            let cursosDoAluno = []
            res.forEach(async (item) => {
                let curso = item.data();
                let objAlunoCursoStatus = {
                    aluno_info: aluno,
                    curso_info: curso.curso_info,
                    resp_info: curso.curso_info,
                    status_info: curso.status_info
                };
                cursosDoAluno.push(objAlunoCursoStatus);
            })
            return cursosDoAluno;
        }).catch((error)=> console.log(error))
    return cursosList;
}

//Retorna um array com a lista completa de todos os alunos e os cursos associados.
async function listaCompletaAlunosCursos() {
    //Const "listaAlunosCursos" recebe recebe o retorno com array com todos os alunos e os cursos associados.
    const listaAlunosCursos = await getAlunosList() //lista com as informações básicas dos alunos.
        .then(async (res) => {
            //Promise.all usada para resolver a promise dentro do map antes de retornar.
            let list = Promise.all(
                res.docs.map((item) => {
                    //retorna objeto aluno com os cursos associados.
                    let ac = getCusosAluno(item.data().aluno);
                    return ac;
                })
            );
            return list;
        }).catch((error)=> console.log(error))
    return listaAlunosCursos;
}

// Extrai o array aninhado com os cursos por aluno retornando um novo array mais 
// simples sendo uma entrada por curso. ex.: [[aluno-1: curso 1 info ...], [aluno-1: curso 2 info ...], [aluno-2: curso 1 info] ...];
function createArrayListCursos(listaCompletaAlunosCursos) {
    let arrListCursos = [];
    listaCompletaAlunosCursos.forEach((item) => {
        item.forEach((i) => { arrListCursos.push(i) })
    })
    return arrListCursos;
}

//Retorna a parcela pendente mais próxima.
function getParcelaPendenteProxima(parcelas) {
    let ultimaParcelaPendente;
    let keys = Object.keys(parcelas).sort();
    for (let k of keys) {
        if (parcelas[k]?.pagamento?.status !== "pago") {
            parcelas[k].numero_parcela = k;
            ultimaParcelaPendente = parcelas[k];
            break;
        }
    }
    return ultimaParcelaPendente;
}

// Pega a última parcela do curso.
function getUltimaParcelaCurso(parcelas){
    let keys = Object.keys(parcelas).sort();
    let lastKey = keys[keys.length - 1];
    parcelas[lastKey].numero_parcela = lastKey;
    return parcelas[lastKey]; 
}
//Gera o status da parcela baseado na data do vencimento e a data atual.
function getParcelaPendenteStatus(parcelaPendente) {
    let parcelaStatus = '';
    if (parcelaPendente?.vencimento) {
        let dataAtual = new Date();
        let dataVencimento = new Date(parcelaPendente.vencimento);
        //Faz as comparações entre a data atual e a data de vencimento. 
        if (dataAtual.getTime() < dataVencimento.getTime()) {
            // Parcela em dia.
            parcelaStatus = 'pagamento_em_dia';
        } else if (dataAtual.getTime() > dataVencimento.getTime()) {
            // Parcela Atrasada.
            let diferenca = dataAtual.getTime() - dataVencimento.getTime();
            let diasVencidos = diferenca / (24 * 3600 * 1000);
            if (diasVencidos >= 7) {
                // 7 dias ou mais de atraso "Muito atrasada".
                parcelaStatus = 'pagamento_muito_atrasado';
            } else {
                // Atrasada poucos dias.
                parcelaStatus = 'pagamento_atrasado';
            }
        } else if (dataAtual.getTime() === dataVencimento.getTime()) {
            // Parcela vencimento hoje.
            parcelaStatus = 'dia_de_pagamento';
        }
    } else {
        //TODO: tratar o erro.
        console.log('erro, vencimento indefinido', parcelaPendente)
    }
    return parcelaStatus;
}

// Cria o conteúdo em HTML da tabela de status dos cursos.
function createTableCursosHTML(filtro, alunosInfo) {
    let tbody = document.createElement('tbody');
    alunosInfo.forEach((item) => {
        let statusCursoSituacao = (item?.status_info?.situacao) ? item.status_info.situacao: 'sem-status'; 
          
        // Última parcela.
        let ultimaParcela = getUltimaParcelaCurso(item.curso_info.parcelas);

        // Formata a data da ultima pacela de "yyyy-mm-dd" para "dd/mm/yyyy".
        let ultimaParcelaFormatada =  new Date(ultimaParcela?.vencimento).toLocaleDateString('pt-br');

        let parcelaPendenteProxima;
        let parcelaPendenteStatus = 'STATUS NÃO ENCONTRADO!';
    
        // Testa se o campo de parcelas é do tipo objeto, evitando possível erro de tipo de dado errado.
        if (typeof item.curso_info.parcelas === 'object') {
            parcelaPendenteProxima = getParcelaPendenteProxima(item.curso_info.parcelas);
            parcelaPendenteStatus = getParcelaPendenteStatus(parcelaPendenteProxima);
        } else {
            // Seta uma mensagem de erro no log caso a parcela não seja do tipo "object".
            setErroLogParcelaObjeto(item);
        }
       
        // Formata a data da pacela pendente de "yyyy-mm-dd" para "dd/mm/yyyy".
        let dataVencimentoFormatado = new Date(parcelaPendenteProxima?.vencimento).toLocaleDateString('pt-br');
        
        let tr = document.createElement('tr');
        tr.setAttribute('data-status', item.status_info?.situacao);

        // Seta o RA mais o código do curso do aluno como id na linha (TR).
        tr.id = item.aluno_info.ra + '-' + item.curso_info.cod;

        // Conteúdo de cada TR da tabela de cursos.
        let trContent = `
        <td class='td_status' >${item.status_info?.situacao ? item.status_info.situacao : ' - '}</td>
        <td class='td_ra'>${item.aluno_info.ra}</td>
        <td class='td_nome'>${item.aluno_info.nome}</td>
        <td class='td_curso'>${item.curso_info.nome}</td>
        <td class='td_parcelas '><span class='${parcelaPendenteStatus}'>parc.: ${parcelaPendenteProxima?.numero_parcela} venc.: ${dataVencimentoFormatado}</span></td>
        <td class='td_ultima_parcela'>parc.: ${ultimaParcela?.numero_parcela} venc.: ${ultimaParcelaFormatada}</td>
        <td class='td_valor_mes'>${item.curso_info.valor_total_mes}</td>
        <td class='td_controles' data-ra='${item.aluno_info.ra}' data-rg='${item.aluno_info.rg}' data-aluno_nome='${item.aluno_info.nome}'>
            <button class='btn_info_aluno'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
            Info
         </button> 
     </td>
        `;
        tr.innerHTML = trContent;
        if(filtro === 'todos'){
            tbody.appendChild(tr);
        }else{
            if(statusCursoSituacao === filtro){
                tbody.appendChild(tr);
            }
        }
    });
    return tbody;
}

// Seta uma mensagem de erro no log quando o item parcela não é um objeto.
function setErroLogParcelaObjeto(item){
    let error = {};
    let RA = item.aluno_info.ra; 
    error.code = "N.D"; error.message = "pacela passada não é do tipo 'object'."; 
    addLogInfo('log_alunato', 'error', RA, error);
    console.log('CORRIGIR! - pacela passada não é do tipo "object"!', item);
}

// Cria os eventos dos botões de informação da página.
function eventsButtonsInfoTableAlunos() {
    let btnsInfoAluno = document.querySelectorAll(".btn_info_aluno");
    btnsInfoAluno.forEach((item) => {
        item.addEventListener('click', (e) => {
            let RA = e.target.closest('td').dataset.ra;
            insertInfoAlunoHTML(RA);
        });
    })
}