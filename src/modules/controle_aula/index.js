import * as insertAulasCursosFunc from "./InsertAulasCursosFunc.js";
import * as dbAlunoHistFunc from "../common/dbAlunoHistoricoFunc.js";
import * as addAulas from "./addAulas.js";

//========================================================================================================
//======================================= FORM ===========================================================
//========================================================================================================
//TODO: Conferir utilidade dessa chamada de função
//addAulas.insertSelectCursosAddAula("RA01");


//========================================================================================================
//======================================= INDEX ========================================================
//========================================================================================================

//--------------------Carrega funções----------------------------
//TODO: Arrumar ordem de execução das funções
(async function loadDocuments() {
  insertAulasCursosFunc.insertAulasWhenChangeAluno();
  //insertAulasCursosFunc.realTimeDataAlunoHistorico("RA01");
  dbAlunoHistFunc.dbRealTimeAlunoHistCursos(
    "RA01",
    insertAulasCursosFunc.insertAulasWhenAlunoChange
  );

  //FORMS
  addAulas.AddEventBtnCloseForm();
  addAulas.navAddFormsDisplayEvent();
  addAulas.eventFormsAdd();
  addAulas.eventSelectAlunoAddAula();
  addAulas.eventSelectAlunoAddCurso();
  addAulas.validaSelectOptionsAddAluno();
  addAulas.insertOptionsAddAlunoRA();
})();
//----------------------------------------------------------
