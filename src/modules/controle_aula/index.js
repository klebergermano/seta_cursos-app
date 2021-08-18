import * as insertAulasCursosFunc from "./InsertAulasCursosFunc.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as formAddAulas from "./formAddAulas.js";
import * as formAddCursos from "./formAddCursos.js";
import * as formAddAlunos from "./formAddAlunos.js";
import * as dragForms from "./dragForms.js";

//TODO: Arrumar ordem de execução das funções
function loadOnStartUp(){
  insertAulasCursosFunc.eventInputSelectAluno();

  dbAlunoHistFunc.dbRealTimeAlunoHistCursos("RA01", insertAulasCursosFunc.insertContentAlunoCurso);

  formAddAulas.navAddFormsDisplayEvent();
  //FORMS
  formAddAulas.eventFormsAdd();
  formAddAulas.AddEventBtnCloseForm();
  formAddAulas.eventSelectAlunoAddAula();

  //Carrega a lista de cursos do primeiro aluno quando inciado
  //no formulário form_add_aulas
  formAddAulas.insertSelectCursosAddAula("RA01");
  
  //Curso
  formAddCursos.eventSelectAlunoAddCurso();
  
  //Aluno
  formAddAlunos.insertOptionsAddAlunoRA();
  
  //TODO: gerando erro ao carregar
 // formAddAlunos.validaSelectOptionsAddAluno();
 //Deletar Aulas
}
loadOnStartUp()

//----------------------------------------------------------
