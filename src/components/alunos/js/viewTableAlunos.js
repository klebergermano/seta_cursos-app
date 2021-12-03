
//firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
//imports
import { insertElementHTML} from "../../js_common/commonFunctions.js";
import { insertFormAddCursoHTML } from "./formAddCurso.js";
import { insertInfoAlunoHTML } from "./infoAluno.js";
//-----------------------------------------------------------------------


export function insertViewTableAlunosHTML() {
    insertElementHTML("#alunos_content", "./components/alunos/viewTableAlunos.html", eventsInserViewTableAlunos, null, true)
}
export function eventsInserViewTableAlunos() {
    getAlunosList()
        .then((res) => {
            return createTableAlunosHTML(res)
        })
        .then((tbody) => {
            document.querySelector('#view_table_alunos tbody').innerHTML = "";
            document.querySelector('#view_table_alunos tbody').innerHTML = tbody.innerHTML;
        }).then(() => {
            insertCursosList()
            eventsButtonsInfoTableAlunos();
        }).catch(err => console.log(err))
}


    function eventsButtonsInfoTableAlunos() {
        let btnsAddCurso = document.querySelectorAll(".btn_add_curso");
        let btnsInfoAluno = document.querySelectorAll(".btn_info_aluno");
        btnsAddCurso.forEach((item) => {
            item.addEventListener('click', (e) => {
                let RA = e.target.closest('td').dataset.ra;
                let alunoNome = e.target.closest('td').dataset.aluno_nome;
                let RG = e.target.closest('td').dataset.rg;
                insertFormAddCursoHTML(RA, alunoNome, RG);
            });
        })
        btnsInfoAluno.forEach((item) => {
            item.addEventListener('click', (e) => {
                let RA = e.target.closest('td').dataset.ra;

                insertInfoAlunoHTML(RA);

            });
        })
    }

    function getAlunosList() {
        let alunatoList = getDocs(collection(db, 'alunato'))
        return alunatoList;
    }

    async function getCusosList(RA) {
        let cursosList = getDocs(collection(db, 'alunato', RA, 'cursos'))
                .then((res)=>{
                    let cursos = document.createElement('div');
                    res.forEach((item)=>{
                        cursos.innerHTML += `<span class="${item.data().curso_info.nome}"> ${item.data().curso_info.nome} </span>`;
                    })
                    return cursos;
                })
        return cursosList;
    }


  function insertCursosList(){
      let TRAlunos = document.querySelectorAll('#view_table_alunos tbody tr');
      let arrTRAlunos = Array.from(TRAlunos);
      arrTRAlunos.forEach((item)=>{
          let RA = item.id;
      getCusosList(RA).then((cursos)=>{
            item.querySelector('.td_cursos').innerHTML = cursos.outerHTML;

          })
      });
    }

    function createTableAlunosHTML(alunosInfo) {
        let tbody = document.createElement('tbody');
   
        alunosInfo.forEach(async (item) => {
            let aluno = item.data().aluno;
            let tr = document.createElement('tr');
            tr.id = aluno.ra;
            let trContent =
                `
            <td class='td_ra'>${aluno.ra}</td>
            <td class='td_nome'>${aluno.nome}</td>
            <td class='td_cursos'></td>
            <td class='td_controles' data-ra='${aluno.ra}'  data-rg='${aluno.rg}' data-aluno_nome='${aluno.nome}'>
            <button class='btn_info_aluno'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
            Info
         </button> 
       
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
        return tbody;
    }



