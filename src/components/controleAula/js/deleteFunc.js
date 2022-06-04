
//Firebase
import { firebaseApp } from "../../dbConfig/firebaseApp.js";
const { getFirestore, doc, updateDoc, deleteField, getDoc } = require("firebase/firestore")
const db = getFirestore(firebaseApp);
//---------------------------------------------------------------//
//Components
import { confirmBoxDelete } from "../../jsCommon/confirmBoxFunc.js";
import { addLogInfo } from "../../logData/js/logFunctions.js";
//---------------------------------------------------------------//

export function eventsDeletarAula() {
    let btn = document.querySelectorAll('.btn_deletar_aula');
    btn.forEach((item) => {
        item.addEventListener('click', (e) => {
            getInfoDeleteAula(item)
        });
    });
}

function getInfoDeleteAula(item) {
    let bg_curso = item.closest('.bg_curso');
    let aula = item.closest('.aulas');
    let aulaInfoDelete = {}
    aulaInfoDelete.RA = bg_curso.dataset.aluno_ra;
    aulaInfoDelete.curso = bg_curso.dataset.curso;
    aulaInfoDelete.aula = aula.dataset.aula;
    aulaInfoDelete.bimestre = aula.dataset.bimestre;
    confirmBoxDelete('#controle_aula', `
    Tem certeza que deseja deletar a <span style='text-transform: capitalize;'><b>${aula.dataset.aula}</b></span>
    <br/>do <span style='text-transform: capitalize;'><b>${aula.dataset.bimestre}</b></span>? <br/> <span style='color:#dd0000'>Essa ação não podera ser desfeita!</span>`, () => {
        deleteDbAula(aulaInfoDelete)
    });
}

function checkIfBimestreIsEmptyToDelete(aulaInfoDelete) {
    let RA = aulaInfoDelete.RA;
    let curso = aulaInfoDelete.curso;
    let docCurso = getDoc(doc(db, 'alunato', RA, 'cursos', curso));
    docCurso.then((res) => {
        let bimestre = res.data().bimestres[aulaInfoDelete.bimestre];
        let keys = Object.keys(bimestre);
        let values = Object.values(bimestre);

        if (keys.length <= 0 || (keys.length === 1 && keys[0] === "feedback bimestral" && values[0].observacao.trim() === "")) {
            deleteBimestre(aulaInfoDelete);
        }
    }).catch((err) => console.log(err));
}

function deleteBimestre(aulaInfoDelete) {
    let RA = aulaInfoDelete.RA;
    let curso = aulaInfoDelete.curso;
    let bimestre = aulaInfoDelete.bimestre;
    let string = `bimestres.${bimestre}`;
    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docAula = doc(db, 'alunato', RA, 'cursos', curso);
    updateDoc(docAula, deleteQuery)
        .then(() => {
            addLogInfo('log_alunato', 'delete', `${RA} - ${curso} - delete_${bimestre}`);
        })
        .catch((error) => {
            console.log(error);
            addLogInfo('log_alunato', 'error', `${RA} - ${curso} - delete_${bimestre}`, error);
        });
}

function deleteDbAula(aulaInfoDelete) {
    let bimestre = aulaInfoDelete.bimestre;
    let RA = aulaInfoDelete.RA;
    let aula = aulaInfoDelete.aula;
    let curso = aulaInfoDelete.curso;
    let string = `bimestres.${bimestre}.${aula}`;
    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docAula = doc(db, 'alunato', RA, 'cursos', curso);
    updateDoc(docAula, deleteQuery).then(() => {
        checkIfBimestreIsEmptyToDelete(aulaInfoDelete)
    })
        .then(() => {
            addLogInfo('log_alunato', 'delete', `${RA} - ${curso} - ${bimestre} - delete_${aula}`);
        })
        .catch((error) => {
            console.log(error);
            addLogInfo('log_alunato', 'error', `${RA} - ${curso} - ${bimestre} - delete_${aula}`, error);
        });
}

