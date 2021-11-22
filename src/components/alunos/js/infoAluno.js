
//firestore
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, getDocs, collection, getDoc, doc } = require("firebase/firestore");
const db = getFirestore(firebaseApp);

//Components
import { insertElementHTML, defaultEventsAfterSubmitFixedForm } from "../../js_common/commonFunctions.js";
//------------------------------------------------------------------------

let $alunoInfo = {
    cursos: {}
}
export function insertInfoAlunoHTML(RA) {
    insertElementHTML('#alunos_content',
        './components/alunos/infoAluno.html', () => { eventsInfoAluno(RA) }, null, true
    );
}

function getInfoAlunoDB(RA) {
    getDoc(doc(db, 'alunato', RA))
        .then((res) => {
            $alunoInfo.aluno = res.data().aluno
        }).then(() => {
            getCursosInfoAlunoDB(RA)
        }).then(()=>{
            insertAlunoInfo()
            console.log($alunoInfo);
        })
}
function getCursosInfoAlunoDB(RA) {
    getDocs(collection(db, 'alunato', RA, 'cursos'))
        .then((res) => {
            res.forEach((item) => {
                let nomeCurso = item.data().curso_info.nome;
                $alunoInfo.cursos[nomeCurso] = item.data();
            })
        })
}

function eventsInfoAluno(RA) {
    getInfoAlunoDB(RA)
}

function insertAlunoInfo(){
    document.querySelector('#aluno_nome').innerHTML = $alunoInfo.aluno.nome;
    document.querySelector('#genero').value = $alunoInfo.aluno.genero;
    document.querySelector('#end').value = $alunoInfo.aluno.end;
    document.querySelector('#end_numero').value = $alunoInfo.aluno.end_numero;
    document.querySelector('#bairro').value = $alunoInfo.aluno.bairro;
    document.querySelector('#cep').value = $alunoInfo.aluno.cep;
    document.querySelector('#rg').value = $alunoInfo.aluno.rg;
    document.querySelector('#cel').value = $alunoInfo.aluno.cel;
    document.querySelector('#tel').value = $alunoInfo.aluno.tel;

}