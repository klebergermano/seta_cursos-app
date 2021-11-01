
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

    function getContratosList(){
        let contratosList = getDocs(collection(db, 'contratos'));
        return contratosList;
    }

    export function insertContratosInfoTable(){
        getContratosList().then((res) => {
            return createTableContratosHTML(res)
        })
        .then((tableContratosHTML)=>{
            document.querySelector('#contratos_submenu_content').innerHTML = ""; 
            document.querySelector('#contratos_submenu_content').appendChild(tableContratosHTML);
        })
        .catch(err => console.log(err))
    }
    
    function createTableContratosHTML (contratosInfo){
    let tableContratosHTML = document.createElement('table'); 
    tableContratosHTML.setAttribute('border', '1'); 
        tableContratosHTML.id='contratos_table_info';
        tableContratosHTML.className='table_info';
        tableContratosHTML.innerHTML = `
        <thead> 
            <th>ID</th>
            <th>Responsável</th>
            <th>Aluno(a)</th>
            <th></th>

    
        </thead>
        <tbody></tbody>`;
        contratosInfo.forEach((item)=>{
            let contrato = item.data();
            let row = document.createElement('tr');
            row.className = 'contratosRow';
       
            let rowContent = 
            `
            <td class='contratosTD contrato_id'>${contrato.metadata.id}</td>
            <td class='contratosTD contrato_resp'>${contrato.resp_info.nome}</td>
            <td class='contratosTD contrato_aluno'>${contrato.aluno_info.nome}</td>
            <td class='contratosTD contrato_aluno'>Deletar | Add</td>
            `
            row.innerHTML = rowContent;
            tableContratosHTML.appendChild(row);
        })
        return tableContratosHTML;
    }