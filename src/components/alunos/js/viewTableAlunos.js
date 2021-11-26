
//firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection } = require("firebase/firestore");
const db = getFirestore(firebaseApp);
//imports
import { insertElementHTML, displayBlockScreen } from "../../js_common/commonFunctions.js";
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
                insertFormAddCursoHTML(RA, alunoNome);

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
        let alunatoList = getDocs(collection(db, 'alunato'));
        return alunatoList;
    }

    function createTableAlunosHTML(alunosInfo) {
        let tbody = document.createElement('tbody');
        alunosInfo.forEach((item) => {
            let aluno = item.data().aluno;
            let tr = document.createElement('tr');
            tr.className = 'alunosRow';
            let trContent =
                `
            <td class='td_ra'>${aluno.ra}</td>
            <td class='td_nome'>${aluno.nome}</td>
            <td class='td_cursos'></td>
            <td class='td_controles' data-ra='${aluno.ra}' data-aluno_nome='${aluno.nome}'>
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
            <button  class='btn_create_talao'> 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
            <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
          </svg>
             Talão
        </button>
            </td>
            `
            tr.innerHTML = trContent;
            tbody.appendChild(tr);
        })
        console.log(tbody);
        return tbody;
    }



