
//firestore
import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore, getDocs, collection} = require("firebase/firestore");
const db = getFirestore(firebaseApp);
//imports
import {insertElementHTML, displayBlockScreen} from "../../js_common/commonFunctions.js"; 
import {insertFormAddCursoHTML} from "./formAddCurso.js"; 
//-----------------------------------------------------------------------


export function insertInfoTableAlunosHTML(){
    insertElementHTML("#alunos_content", "./components/alunos/infoTableAlunos.html",  eventsInserInfoTableAlunos, null, true)
}
    export function eventsInserInfoTableAlunos(){
        getAlunosList()
        .then((res) => {
            return createTableAlunosHTML(res)
        })
        .then((tbody)=>{
            document.querySelector('#table_info_alunos tbody').innerHTML = ""; 
            document.querySelector('#table_info_alunos tbody').innerHTML = tbody.innerHTML;
        }).then(()=>{
            eventsButtonsInfoTableAlunos();
        })
        .catch(err => console.log(err))
    }

    function eventsButtonsInfoTableAlunos(){
        let btnsAddCurso = document.querySelectorAll(".btn_add_curso");
        btnsAddCurso.forEach((item)=>{
           item.addEventListener('click', (e)=>{
            insertFormAddCursoHTML();
            displayBlockScreen();
           });
        })
    
    }

    function getAlunosList(){
        let alunatoList = getDocs(collection(db, 'alunato'));
        return alunatoList;
    }
    
    function createTableAlunosHTML (alunosInfo){
        let tbody = document.createElement('tbody');
        alunosInfo.forEach((item)=>{
            let aluno = item.data().aluno;
            let tr = document.createElement('tr');
            tr.className = 'alunosRow';
            let trContent = 
            `
            <td class='td_ra'>${aluno.ra}</td>
            <td class='td_nome'>${aluno.nome}</td>
            <td class='td_cursos'></td>
            <td class='td_controles' data-ra='${aluno.ra}'>
            <button class='btn_ver_info'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
            Info
        </button> 
        <!--
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg> 
                Editar
            </button>  | 
        -->

            <button  class='btn_add_curso'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                </svg>
                 Curso
            </button>
            </td>
            `
            tr.innerHTML = trContent;
            tbody.appendChild(tr);
        })
        console.log(tbody);
        return tbody;
    }

