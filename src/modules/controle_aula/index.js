import * as insertAulasCursosFunc from "./InsertAulasCursosFunc.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as formAddAulas from "./formAddAulas.js";
import * as formAddCursos from "./formAddCursos.js";
import * as formAddAlunos from "./formAddAlunos.js";

//TODO: Arrumar ordem de execução das funções
function loadOnStartUp(){
  insertAulasCursosFunc.insertAulasWhenChangeAluno();
  //insertAulasCursosFunc.realTimeDataAlunoHistorico("RA01");
  dbAlunoHistFunc.dbRealTimeAlunoHistCursos("RA01",
insertAulasCursosFunc.insertAulasWhenAlunoChange
  );

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
  formAddAlunos.validaSelectOptionsAddAluno();

}
loadOnStartUp()

//----------------------------------------------------------
