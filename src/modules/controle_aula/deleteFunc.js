
export function eventDeleteCurso(){
    let btn_deletar_curso = document.querySelectorAll('.btn_deletar_curso');
    btn_deletar_curso.forEach((item)=>{
        item.addEventListener('click', (e)=>{
            deleteCurso(e.target)
        });
    })
}
 function deleteCurso(btn){
     console.log(btn);
    let aulaInfoDelete = {};
    aulaInfoDelete.RA = btn.dataset.aluno_ra;
    aulaInfoDelete.curso =  btn.dataset.delete_curso;
    console.log(aulaInfoDelete);
     db.collection("aluno_historico")
    .doc(aulaInfoDelete.RA)
    .collection("cursos")
    .doc(aulaInfoDelete.curso)
    .delete()
   
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
    /*
    if(confirm(`Tem certeza de que deseja deletar do ${aulaInfoDelete.bimestre.toUpperCase()} a ${aulaInfoDelete.aula.toUpperCase()}? 
Essa ação não poderá ser desfeita!`)){
    }
    */
    deleteDbAula(aulaInfoDelete)

}


function deleteDbAula(aulaInfoDelete){
    let bimestre = aulaInfoDelete.bimestre;
    let aula = aulaInfoDelete.aula;
    let string = `bimestres.${bimestre}.${aula}`;
    let deleteQuery = {};
    deleteQuery[string] = firebase.firestore.FieldValue.delete();

    let delAula = db.collection("aluno_historico")
    .doc(aulaInfoDelete.RA)
    .collection("cursos")
    .doc(aulaInfoDelete.curso)
    .update(deleteQuery);
    delAula.then(()=>{
        checkIfBimestreIsEmptyToDelete(aulaInfoDelete)
    });
}


function checkIfBimestreIsEmptyToDelete(aulaInfoDelete){

    let bimestres = db.collection("aluno_historico")
    .doc(aulaInfoDelete.RA)
    .collection("cursos")
    .doc(aulaInfoDelete.curso)
    .get('bimestres');
    bimestres.then((res)=>{
        let bimestre = res.data().bimestres[aulaInfoDelete.bimestre];
        let keys = Object.keys(bimestre);
            if(keys.length <= 0){
                deleteBimestre(aulaInfoDelete);
            }
    });
}

function deleteBimestre(aulaInfoDelete){

    let bimestre = aulaInfoDelete.bimestre;
    let string = `bimestres.${bimestre}`;
    let deleteQuery = {};
    deleteQuery[string] = firebase.firestore.FieldValue.delete();
    db.collection("aluno_historico")
    .doc(aulaInfoDelete.RA)
    .collection("cursos")
    .doc(aulaInfoDelete.curso)
    .update(deleteQuery);
}
