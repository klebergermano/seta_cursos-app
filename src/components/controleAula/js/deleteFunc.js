

import {firebaseApp} from "../../dbConfig/firebaseApp.js";
const {getFirestore,  doc, deleteDoc,  updateDoc, deleteField, getDoc} = require("firebase/firestore") 
const db = getFirestore(firebaseApp);

import * as commonFunc from "../../js_common/commonFunctions.js";
import * as navCursosAluno from "./navCursosAluno.js";

export function eventDeleteCurso(){
    let btn_deletar_curso = document.querySelectorAll('.btn_deletar_curso');
    btn_deletar_curso.forEach((item)=>{
        item.addEventListener('click', (e)=>{
        commonFunc.confirmBoxDelete('#aluno_content', "Tem certeza que deseja deletar?", ()=>{
            deleteCurso(e.target)
        });
        });
    })
}


export function eventsDeletarAula(){
    let btn = document.querySelectorAll('.btn_deletar_aula');
    btn.forEach((item)=>{
        item.addEventListener('click', (e)=>{
            getInfoDeleteAula(item)
        });
    });
}

function getInfoDeleteAula(item){
    let bg_curso = item.closest('.bg_curso');
    let aula = item.closest('.aulas');
    let aulaInfoDelete = {}
    aulaInfoDelete.RA = bg_curso.dataset.aluno_ra;
    aulaInfoDelete.curso = bg_curso.dataset.curso;
    aulaInfoDelete.aula = aula.dataset.aula;
    aulaInfoDelete.bimestre = aula.dataset.bimestre;
    commonFunc.confirmBoxDelete('#aluno_content', "Tem certeza que deseja deletar essa aula? <br/> <span style='color:#dd0000'>Essa ação não podera ser desfeita!</span>", ()=>{
    deleteDbAula(aulaInfoDelete)
    });
}

function checkIfBimestreIsEmptyToDelete(aulaInfoDelete){
    let RA = aulaInfoDelete.RA; 
    let curso = aulaInfoDelete.curso; 
    let docCurso = getDoc(doc(db, 'alunato', RA, 'cursos', curso));
    docCurso.then((res)=>{
        let bimestre = res.data().bimestres[aulaInfoDelete.bimestre];
        let keys = Object.keys(bimestre);
        if(keys.length <= 0){
            deleteBimestre(aulaInfoDelete);
           
        }
    }).catch((err)=> console.log(err));
}

function deleteCurso(btn){

    let RA = btn.dataset.aluno_ra;
    let curso =  btn.dataset.delete_curso;
    deleteDoc(doc(db, 'alunato', RA, 'cursos', curso))
    .then(()=>{
        navCursosAluno.displayFirstCursoAluno();
    }).then(()=>{
        commonFunc.  changeCSSDisplay("#block_screen", "none");
    }).catch((err)=> console.log(err));;
}

function deleteBimestre(aulaInfoDelete){
    let RA = aulaInfoDelete.RA;
    let curso = aulaInfoDelete.curso;
    let bimestre = aulaInfoDelete.bimestre;
    let string = `bimestres.${bimestre}`;
    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docAula = doc(db, 'alunato', RA, 'cursos', curso);
    updateDoc(docAula, deleteQuery)
}

function deleteDbAula(aulaInfoDelete){
    let bimestre = aulaInfoDelete.bimestre;
    let RA = aulaInfoDelete.RA;
    let aula = aulaInfoDelete.aula;
    let curso = aulaInfoDelete.curso; 
    let string = `bimestres.${bimestre}.${aula}`;
    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docAula = doc(db, 'alunato', RA, 'cursos', curso);
    updateDoc(docAula, deleteQuery).then(()=>{
        checkIfBimestreIsEmptyToDelete(aulaInfoDelete)
    }).catch((err)=> console.log(err));
}

