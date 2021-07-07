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
    setTimeout(()=>{
      document.getElementById(targetID).innerHTML = previousHTML;
    }, 2000);
    //restaura a função de fechar do formulário
    setTimeout(()=>{
      AddEventBtnCloseForm()
    }, 2200);

  }

  function formAddAluno(e){
    e.preventDefault();
    let form = e.target;
    let alunoHistorico = db.collection("aluno_historico");
    alunoHistorico
      .doc(form.ra.value)
      .collection("cursos")
      .doc(form.curso.value)
      .set({
        bimestres: {
          bimestre_1: {},
        },
      })
      .then(() => {
        alunoHistorico
          .doc(form.ra.value)
          .set({ nome: form.nome.value }, { merge: true });
      })
      //Remove conteúdo do formulário e acrescenta a mensagem
      .then(() => showMessage("form_add_aluno", "Aluno salvo com sucess!"))
      //tira o diplay do formulário e block_screen
      .then(() => {
        setTimeout(() => {
          e.target.style.display = "none";
          changeCSSDisplay("#block_screen", "none");
        }, 1500);
      })
      .catch((error) => console.error("Error writing document: ", error));
  }
  
  function eventFormAddAluno() {
    document.querySelector("#form_add_aluno").addEventListener("submit", (e) => {
  formAddAluno(e);
    });
  }

  function formAddAula(RA) {
    document.querySelector("#form_add_aula").addEventListener("submit", (e) => {
      e.preventDefault();
      let form = e.target;
      aulaHistorico = db
        .collection("aluno_historico")
        .doc(RA)
        .collection("cursos")
        .doc("IFC")
        .update({
          "bimestres.bimestre_1": "FUlano dtestse tlsket slt e",
        });
    });
  }
  
  (async function loadDocuments() {
    // const alunoDB = await alunoHistoricoDB('RA01');
    //InsertBlockAulas(alunoDB);
    //formAddAluno();
   // formAddAula();
    AddEventBtnCloseForm();
    navAddFormsDisplayEvent();
    eventFormAddAluno();
  
  })();