
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection, deleteDoc, doc, setDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
const { getAuth } = require("firebase/auth");
const auth = getAuth(firebaseApp);
//---------------------------------------------------------------//
//Components
import insertElementHTML from "../../jsCommon/insertElementHTML.js";
import { confirmBoxDelete } from "../../jsCommon/confirmBoxFunc.js";
import { insertFormAddCursosInfoHTML } from "./formAddCursoInfo.js";
import { removeUnauthorizedElement } from "../../../appContent/js/checkPermission.js";
import { addLogInfo } from "../../logData/js/logFunctions.js"
//---------------------------------------------------------------//
let $cursosList = {};
function getCusosInfoList() {
    let cursosInfoList = getDocs(collection(db, 'cursos_info'));
    return cursosInfoList;
}
export async function insertViewTableCursosInfoHTML() {
    insertElementHTML("#cursos_info_content", "./components/cursosInfo/viewTableCursosInfo.html", eventsViewTableCursosInfo, null, true)
}

function eventsViewTableCursosInfo() {
    getCusosInfoList()
        .then((res) => {
            $cursosList = res;
            return createTableCursosInfoHTML(res)
        })
        .then((tbody) => {
            document.querySelector('#view_table_cursos_info tbody').outerHTML = tbody.outerHTML;
        }).then(() => {
            eventBtnDeleteCursoInfo();
            eventsEditCursoInfo();
            removeUnauthorizedElement(window.$PERMISSIONS);

        })
        .catch(err => console.log(err))
}

function setEditCursoInfo(trInfo) {
    setTimeout(() => {
        let formEdit = document.querySelector('#form_add_curso_info');
        formEdit.classList.add('form_edit_curso_info');
        formEdit.querySelector('#nome').setAttribute('readonly', true);
        formEdit.querySelector('#nome').value = trInfo.querySelector('#td_nome').innerHTML;
        formEdit.querySelector('#valor_mes').value = trInfo.querySelector('#td_valor').innerHTML;
        formEdit.querySelector('#parcelas').value = trInfo.querySelector('#td_parcelas').innerHTML;
        formEdit.querySelector('#modulos').value = trInfo.querySelector('#td_modulos textarea').innerHTML;
        formEdit.querySelector('#modulos_certificado').value = trInfo.querySelector('#td_modulos_certificado textarea').innerHTML;
        formEdit.querySelector('#duracao').value = trInfo.querySelector('#td_duracao').innerHTML;
        formEdit.querySelector('#carga_horaria').value = trInfo.querySelector('#td_carga_horaria').innerHTML;
        formEdit.querySelector('#id_curso').value = trInfo.querySelector('#td_id_curso').innerHTML;
        let selectCategoria = formEdit.querySelector('#categoria')
        let arrOptions = Array.from(selectCategoria.options);
        arrOptions.forEach((item) => {
            if (item.value === trInfo.querySelector('#td_categoria').innerHTML) {
                item.setAttribute('selected', true);
            }
        });
    }, 100);
}

function eventsEditCursoInfo() {
    let btns = document.querySelectorAll('.btn_edit_curso_info');

    btns.forEach((item) => {
        item.addEventListener('click', (e) => {
            let trInfo = e.target.closest('tr');
            insertFormAddCursosInfoHTML();
            setEditCursoInfo(trInfo)
        })
    });
}

function eventBtnDeleteCursoInfo() {
    let btns = document.querySelectorAll('.btn_delete_curso_info');
    btns.forEach((item) => {
        item.addEventListener('click', (e) => {
            let cursoNome = e.target.closest('tr').dataset.curso_info_nome;
            let idCurso = e.target.closest('tr').dataset.id_curso;
            let msg = `<span style='color:red'><b>ATENÇÃO</b></span>
            <br/>Tem certeza que deseja deletar o Curso Info <b>${cursoNome}</b>?
            <br/>Essa ação não podera ser desfeita!`;
            confirmBoxDelete("#bg_cursos_info_content", msg, () => {
                submitDeleteCursoInfo(idCurso, cursoNome)
            })
        })
    })
}

function createTableCursosInfoHTML(cursosInfo) {
    let tbody = document.createElement('tbody');
    cursosInfo.forEach((item) => {
        let curso = item.data();
        let tr = document.createElement('tr');
        tr.setAttribute('data-id_curso', curso.cod);
        tr.setAttribute('data-curso_info_nome', curso.nome)

        let trContent =
            `
            <td id='td_id_curso'>${curso.cod}</td>
            <td id='td_nome' class='color_${curso.nome}'>${curso.nome}</td>
            <td id='td_categoria'>${curso.categoria}</td>
            <td id='td_modulos'><textarea readonly='true'>${curso.modulos}</textarea></td>
            <td id='td_modulos_certificado'><textarea readonly='true'>${curso.modulos_certificado}</textarea></td>
            <td id='td_duracao'>${curso.duracao}</td>
            <td id='td_parcelas'>${curso.parcelas}</td>
            <td id='td_carga_horaria'>${curso.carga_horaria}</td>
            <td id='td_valor'>${curso.valor}</td>
            <td>
            <button data-auth='admin' class='btn_edit_curso_info'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
            </button> 
            </td>
        <td>
           <button data-auth='admin' title="Deletar Curso" class='btn_delete_curso_info'>
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

function submitDeleteCursoInfo(idCurso) {
    deleteDoc(doc(db, 'cursos_info', idCurso))
        .then(() => {
            insertViewTableCursosInfoHTML();
        }).then(() => {
            addLogInfo("log_cursos_info", 'delete', idCurso);
        }).catch((error) => {
            addLogInfo("log_cursos_info", 'error', idCurso, error)
        })
}  