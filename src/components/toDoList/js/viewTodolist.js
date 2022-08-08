//Firebase

//---------------------------------------------------------------//
//Components
//import insertElementHTML from "../../components/jsCommon/insertElementHTML.js";
import dragElementAbsolute from "../../../functions/dragElementAbsolute.js";

import $ from "../../../functions/$.js"
import appendExternElHTML from "../../../functions/appendExternElHTML.js";
import pipe from "../../../functions/pipe.js";
//---------------------------------------------------------------//

const viewTodolist = (() => {
  async function appendViewTodolist() {
    const bgViewTablaTodolist = $("bg_view_table_todolist")
    bgViewTablaTodolist
    ? $('page_content').removeChild(bgViewTablaTodolist) // Se bg_view_table_todolist existe é removido do page_element.
    : (await appendExternElHTML('./components/todoList/viewTodolist.html'))('page_content')(_eventsTodolist.bind(viewTodolist)) ; // Se não existir é adicionado.
    }

    function _eventsTodolist() {
      _btnCloseViewTodolist()
      dragElementAbsolute($('bg_view_table_todolist'));
    }

  function _btnCloseViewTodolist() {
    $('btn_close_view_todolist')?.addEventListener('click', () => {
      $('page_content').removeChild($('bg_view_table_todolist'))
    });
  }


  //Retorna as funções plublicas.
  return {
    appendViewTodolist
  }
})();

export default viewTodolist;


