//Firebase

//---------------------------------------------------------------//
//Components
//import insertElementHTML from "../../components/jsCommon/insertElementHTML.js";
import dragElementAbsolute from "../../components/jsCommon/dragElementAbsolute.js";
import $ from "../../functions/$.js"
//import insertElementHTML from "../../functions/insertElementHTML.js";
import appendExternalElementHTML from "../../functions/insertElementHTML.js";
import pipe from "../../functions/pipe.js";
//---------------------------------------------------------------//

const viewTodolist = (() => {

  async function appendViewTodolist (){
    (await appendExternalElementHTML('./appContent/viewTodolist.html'))('page_content')(_eventsTodolist.bind(viewTodolist))
   }

  async function appendViewTodolist() {
    const bgViewTablaTodolist = $("bg_view_table_todolist")
    //bgViewTablaTodolist
      //? $('page_content').removeChild(bgViewTablaTodolist) // Se bg_view_table_todolist existe é removido do page_element.
     // : appendExternalElementHTML('./appContent/viewTodolist.html', 'page_content', _eventsTodolist.bind(viewTodolist)); // Se não existir é adicionado.
  
     if(bgViewTablaTodolist){
      $('page_content').removeChild(bgViewTablaTodolist)
     }else{
    (await appendExternalElementHTML('./appContent/viewTodolist.html'))('page_content')(_eventsTodolist.bind(viewTodolist))
      
     }
    }

    function _eventsTodolist() {
      // _CloseViewTodolistClickOutside() // Fecha a view to todolist quando clicado fora do elemento.
      _btnCloseViewTodolist()
      dragElementAbsolute($('bg_view_table_todolist'));
    }


  function _btnCloseViewTodolist() {
    $('btn_close_view_todolist')?.addEventListener('click', () => {
      $('page_content').removeChild($('bg_view_table_todolist'))
    });
  }

  // Fecha a view do todolist quando clicado fora o elemento "#bg_view_table_todolist".
  function _closeViewTodolistClickOutside() {
    document.addEventListener('click', (e) => {
      const isClickedInside = e.target.closest('#bg_view_table_todolist')
      const bgViewTableTodolist = $('bg_view_table_todolist');
      if (!isClickedInside && bgViewTableTodolist && e.target.id !== 'btn_todolist') {
        $('page_content').removeChild(bgViewTableTodolist)
      }
    })
  }
  //Retorna as funções plublicas.
  return {
    appendViewTodolist
  }
})();


export default viewTodolist;


