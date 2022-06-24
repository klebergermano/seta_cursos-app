//Components
import { insertViewTableAlunosHTML } from "../js/viewTableAlunos.js";
import { insertViewTableStatusCursosHTML } from "../js/viewTableStatusCursos.js";
import { insertFormAddAlunoHTML } from "../js/formAddAluno.js";
//---------------------------------------------------------------//

export function onload() {
    document.querySelector('#btn_add_aluno').addEventListener('click', (e) => {
        insertFormAddAlunoHTML();
    })
    document.querySelector('#btn_alunos_view_table').addEventListener('click', (e) => {
        insertViewTableAlunosHTML()
    })
    document.querySelector('#btn_status_cursos_view_table').addEventListener('click', (e) => {
        insertViewTableStatusCursosHTML()
    })


    insertViewTableAlunosHTML()


}



