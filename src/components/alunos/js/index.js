import * as formAddAluno from "../js/formAddAluno.js"

import {firebaseApp} from "../../dbConfig/firebaseApp.js";

const {getFirestore, collection, getDocs } = require("firebase/firestore") 
const db = getFirestore(firebaseApp);



    function getAlunosList(){
        let alunatoList = getDocs(collection(db, 'alunato'));
        return alunatoList;
    }

    function inserAlunosInfoInPage(){
        getAlunosList().then((res) => {
            return createTableAlunosHTML(res)
        })
        .then((tableAlunosHTML)=>{
            document.querySelector('#alunos_content').appendChild(tableAlunosHTML);
        })
        .catch(err => console.log(err))
    }
    
    function createTableAlunosHTML (alunosInfo){
    let tableAlunosHTML = document.createElement('table'); 
    tableAlunosHTML.setAttribute('border', '1'); 
        tableAlunosHTML.id='alunos_table_info';
        tableAlunosHTML.className='table_info';
        tableAlunosHTML.innerHTML = `
        <thead> 
            <th>RA</th>
            <th>Nome</th>
            <th>Email</th>

    
        </thead>
        <tbody></tbody>`;
        alunosInfo.forEach((item)=>{
            let aluno = item.data().aluno;
            console.log(aluno);
            let row = document.createElement('tr');
            row.className = 'alunosRow';
       
            let rowContent = 
            `
            <td class='alunosTD aluno_ra'>${aluno.ra}</td>
            <td class='alunosTD aluno_nome'>${aluno.nome}</td>
            <td class='alunosTD aluno_nome'>${aluno.email}</td>
            `
            row.innerHTML = rowContent;
            tableAlunosHTML.appendChild(row);
        })
        return tableAlunosHTML;
    }
   

export function onload(){
    console.log('alunos');
   
    document.querySelector('#btn_add_aluno').addEventListener('click', (e)=>{
        formAddAluno.insertFormAddAlunoHTML();
    })

    inserAlunosInfoInPage()
}



