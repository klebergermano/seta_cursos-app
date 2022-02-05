
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection, deleteDoc, doc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { confirmBoxDelete } from "../../jsCommon/confirmBoxFunc.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//Funções do Component
import { insertInfoContratoHTML } from "./infoContrato.js";
//---------------------------------------------------------------//
let $contratosLista = {};
function getContratosList() {
    let contratosList = getDocs(collection(db, 'contratos'));
    return contratosList;
}
export function insertViewTableContratosHTML() {
    insertElementHTML("#contratos_content", "./components/contratos/viewTableContratos.html", eventsViewTableContratos, null, true)
}

function eventsViewTableContratos() {
    getContratosList()
        .then((res) => {
            $contratosLista = res;
            return createTableContratosHTML(res)
        })
        .then((tbody) => {
            document.querySelector('#view_table_contratos tbody').outerHTML = tbody.outerHTML;
        }).then(() => {
            eventBtnDeleteContrato()
        }).then(() => {
            let btns = document.querySelectorAll('.btn_info_aluno');
            btns.forEach((item) => {
                item.addEventListener('click', (e) => {

                    let idContrato = e.target.closest('tr').dataset.id_contrato;
                    insertInfoContratoHTML(idContrato)
                });
            });
        })
        .catch(err => console.log(err))
}

function eventBtnDeleteContrato() {
    let btns = document.querySelectorAll('.btn_delete_contrato');
    let arrBtns = Array.from(btns);
    arrBtns.forEach((item) => {
        item.addEventListener('click', (e) => {
            let idContrato = e.target.closest('td').dataset.id_contrato;
            let alunoNome = e.target.closest('td').dataset.aluno_nome;
            let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
            <br/>Tem certeza que deseja deletar o contrato <b>${idContrato}</b> referente ao aluno <b>${alunoNome}</b>?
            <br/>Essa ação não podera ser desfeita!`;
            confirmBoxDelete("#bg_contrato_content", msg, () => {
                submitDeleteContrato(idContrato)
            })
        })
    })
}

function submitDeleteContrato(idContrato) {
    deleteDoc(doc(db, 'contratos', idContrato))
        .then(() => {
            insertViewTableContratosHTML()
        })
        .then(() => {
            addLogInfo('log_contratos', 'delete', idContrato)
        })
        .catch((error) => {
            addLogInfo('log_contratos', 'error', idContrato, error)
            console.log(err);
        })
}

function createTableContratosHTML(contratosInfo) {
    let tbody = document.createElement('tbody');
    contratosInfo.forEach((item) => {
        let contrato = item.data();
        let tr = document.createElement('tr');
        tr.classList = contrato.metadata.status;

        tr.setAttribute('data-id_contrato', contrato.metadata.id);
        let disabled;
        let title = "Deletar contrato";
        let buttonDelete = "";
        if (contrato.metadata.aluno_associado !== 'pendente') {
            disabled = 'disabled="true"';
            title = "Somente contratos sem aluno associado podem ser deletados";
            buttonDelete = `<button ${disabled} title="${title}" class='btn'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>`
        } else {
            buttonDelete = `<button ${disabled} title="${title}" class='btn_delete_contrato'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>`
        }
        let trContent =
            `
            <td class='td_contrato_id'>${contrato.metadata.id}</td>
            <td class='td_resp_nome'>${contrato.resp_info.nome}</td>
            <td class='td_aluno_nome'>${contrato.aluno_info.nome}</td>
            <td class='td_aluno_assoc'>${contrato.metadata.aluno_associado}</td>
            <td class='td_contrato_status'>${contrato.metadata.status}</td>
            <td class='td_contrato_info'>
            <button class='btn_info_aluno'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
            Info
         </button> 
            </td>
            <td class='td_controls' data-id_contrato="${contrato.metadata.id}"  data-aluno_nome="${contrato.aluno_info.nome}">
            ${buttonDelete}
            </td>
            `
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    })
    return tbody;
}