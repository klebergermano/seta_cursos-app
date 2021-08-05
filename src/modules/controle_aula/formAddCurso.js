function formAddCurso(e) {
    e.preventDefault();
    let form = e.target;
    let RA = form.select_aluno_add_curso.value;
    let alunoHistorico = db.collection("aluno_historico");
    alunoHistorico
      .doc(RA)
      .collection("cursos")
      .doc(form.add_curso_nome_curso.value)
      .set(
        {
          curso: form.add_curso_nome_curso.value,
          bimestres: {
            ["bimestre 1"]: {},
          },
        },
        { merge: true }
      )
  
      //Remove conteúdo do formulário e acrescenta a mensagem
      .then(() => showMessage("form_add_aluno", "Aluno salvo com sucesso!"))
      //tira o diplay do formulário e block_screen
      .then(() => {
        setTimeout(() => {
          e.target.style.display = "none";
          changeCSSDisplay("#block_screen", "none");
        }, 500);
      })
      .then(() => {
        //seta o #select_aluno com o RA que acabou de ser atualizado
        setSelectedInASelectBasedOnRA("#select_aluno", RA);
        setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
        
      })
      .catch((error) => console.error("Error writing document: ", error));
  }