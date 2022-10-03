function deleteItemTodolistDB(idItem) {
    /*
    let bimestre = aulaInfoDelete.bimestre;
    let RA = aulaInfoDelete.RA;
    let aula = aulaInfoDelete.aula;
    let curso = aulaInfoDelete.curso;
    */
    let string = `bimestres.${bimestre}.${aula}`;
    let deleteQuery = {};
    deleteQuery[string] = deleteField();
    const docTodolist = doc(db, 'users', UID, 'content', 'to-do_list');
    updateDoc(docTodolist, deleteQuery).then(() => {
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


 const removeItemTodolist = (e) => {
    const btn = e.target; 
    const tr = btn.closest('tr'); 
    console.log(tr)
    deleteItemTodolistDB()
}
export default removeItemTodolist; 