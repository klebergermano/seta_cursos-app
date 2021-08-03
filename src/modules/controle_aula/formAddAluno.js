function eventFormsAdd() {
  document.querySelector("#form_add_aluno").addEventListener("submit", (e) => {
    formAddAluno(e);
  });
  document.querySelector("#form_add_aula").addEventListener("submit", (e) => {
    formAddAula(e);
  });
  document.querySelector("#form_add_curso").addEventListener("submit", (e) => {
    formAddCurso(e);
  });
}

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

function changeCSSDisplay(target, display) {
  document.querySelector(target).style.display = display;
}
//Insere os cursos do aluno quando o select_aluno_add_aula é alterado
function eventSelectAlunoAddAula() {
  let aluno = document.querySelector("#select_aluno_add_aula");
  aluno.addEventListener("input", (e) => {
    selectAlunoAddAula(e);
  });
}

function selectAlunoAddAula(e) {
  let RA = e.target.value;
  insertSelectCursosAddAula(RA);
}

insertSelectCursosAddAula("RA01");

function AddEventBtnCloseForm() {
  document.querySelectorAll(".close_form").forEach((item) => {
    item.addEventListener("click", (e) => {
      closeForm(e);
    });
  });
}

function closeForm(e) {
  //Pega o elemento "parent" do event e set display none.
  e.target.parentElement.style.display = "none";
  changeCSSDisplay("#block_screen", "none");
}

function navAddFormsDisplayEvent() {
  document.querySelector("#btn_add_curso").addEventListener("click", () => {
    changeCSSDisplay("#form_add_curso", "block");
    changeCSSDisplay("#block_screen", "block");
  });
  document.querySelector("#btn_add_aluno").addEventListener("click", () => {
    changeCSSDisplay("#form_add_aluno", "block");
    changeCSSDisplay("#block_screen", "block");
  });
  document.querySelector("#btn_add_aula").addEventListener("click", () => {
    changeCSSDisplay("#form_add_aula", "block");
    changeCSSDisplay("#block_screen", "block");
  });
}

function showMessage(targetID, message) {
  let previousHTML = document.getElementById(targetID).innerHTML;
  document.getElementById(
    targetID
  ).innerHTML = `<div class='show_message'>${message}</div>`;
  setTimeout(() => {
    document.getElementById(targetID).innerHTML = previousHTML;
  }, 2000);
  //restaura a função de fechar do formulário
  setTimeout(() => {
    AddEventBtnCloseForm();
  }, 2200);
}

function formAddAluno(e) {
  e.preventDefault();
  let form = e.target;
  let alunoHistorico = db.collection("aluno_historico");
  alunoHistorico
    .doc(form.add_aluno_ra.value)
    .collection("cursos")
    .doc(form.curso_nome.value)
    .set({
      curso: form.curso_nome.value,
      bimestres: {
        ["bimestre 1"]: {},
      },
    })
    .then(() => {
      alunoHistorico
        .doc(form.add_aluno_ra.value)
        .set({ nome: form.nome.value }, { merge: true });
    })
    //Remove conteúdo do formulário e acrescenta a mensagem
    .then(() => showMessage("form_add_aluno", "Aluno salvo com sucesso!"))
    //tira o diplay do formulário e block_screen
    .then(() => {
      setTimeout(() => {
        e.target.style.display = "none";
        changeCSSDisplay("#block_screen", "none");
      }, 500);
    })
    .catch((error) => console.error("Error writing document: ", error));
}

function blocoAddAula(dados) {
  let aula = {
    [dados.select_bimestre_add_aluno.value]: {
      [dados.aula_numero.value]: {
        tema: dados.tema.value,
        data: dados.data.value,
        horario: dados.horario.value,
        detalhes: dados.detalhes.value,
      },
    },
  };
  return aula;
}
function formAddAula(e) {
  e.preventDefault();
  let form = e.target;
  let RA = form.select_aluno_add_aula.value;
  aulaHistorico = db
    .collection("aluno_historico")
    .doc(RA)
    .collection("cursos")
    .doc(form.select_curso_add_aluno.value)
    .set(
      {
        bimestres: blocoAddAula(form),
      },
      { merge: true }
    )
    //Remove conteúdo do formulário e acrescenta a mensagem
    .then(() => showMessage("form_add_aluno", "Aula adicionada com sucesso!"))
    .then(() => {
      setTimeout(() => {
        e.target.style.display = "none";
        changeCSSDisplay("#block_screen", "none");
      }, 500);
    })
    .then(() => {
      //seta o #select_aluno com o RA que acabou de ser atualizado
      setSelectedInASelectBasedOnRA("#select_aluno_add_aula", RA);
      setSelectedInASelectBasedOnRA("#select_aluno_add_curso", RA);
    })
    .catch((error) => console.error("Error writing document: ", error));
}

(async function loadDocuments() {
  AddEventBtnCloseForm();
  navAddFormsDisplayEvent();
  eventFormsAdd();
  eventSelectAlunoAddAula();
  eventSelectAlunoAddCurso();
  validaSelectOptionsAddAluno();
  insertOptionsAddAlunoRA();

})();
