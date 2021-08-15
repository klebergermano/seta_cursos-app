
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
   deleteDbAula(aulaInfoDelete)



}

function deleteDbAula(aulaInfoDelete){
    console.log(aulaInfoDelete);
    let bimestre = aulaInfoDelete.bimestre;
    let aula = aulaInfoDelete.aula;
    let string = `bimestres.${bimestre}.${aula}`;
    let deleteQuery = {};
    deleteQuery[string] = firebase.firestore.FieldValue.delete();
    
    db.collection("aluno_historico")
    .doc(aulaInfoDelete.RA)
    .collection("cursos")
    .doc(aulaInfoDelete.curso)
    .update(deleteQuery)
}