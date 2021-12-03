
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

let $contratosLista = {};
import { insertElementHTML} from "../../js_common/commonFunctions.js";
    function getContratosList(){
        let contratosList = getDocs(collection(db, 'contratos'));
        return contratosList;
    }
    export function insertViewTableContratosHTML(){
        insertElementHTML("#contratos_content", "./components/contratos/viewTableContratos.html",  eventsViewTableContratos, null, true)
    }
    function eventsViewTableContratos(){
        getContratosList()
        .then((res) => {
         $contratosLista = res;
            return createTableContratosHTML(res)
        })
        .then((tbody)=>{
            document.querySelector('#view_table_contratos tbody').outerHTML = tbody.outerHTML;
        })
        .catch(err => console.log(err))
    }

    function createTableContratosHTML (contratosInfo){
    let tbody = document.createElement('tbody'); 
        contratosInfo.forEach((item)=>{
            let contrato = item.data();
            let tr = document.createElement('tr');
            tr.classList = contratosInfo.metadata.aluno_associado;
            let trContent = 
            `
            <td class='td_contrato_id'>${contrato.metadata.id}</td>
            <td class='td_resp_nome'>${contrato.resp_info.nome}</td>
            <td class='td_aluno_nome'>${contrato.aluno_info.nome}</td>
            <td class='td_aluno_nome'>${contrato.metadata.aluno_associado}</td>
            <td class='td_aluno_nome'>${contrato.metadata.status}</td>
            <td class='td_controls'>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </td>
            `
            tr.innerHTML = trContent;
            tbody.appendChild(tr);
        })
        return tbody;
    }