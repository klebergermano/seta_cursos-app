import viewTodoList from "./viewTodoList.js";

const atualizaViewTodoList = () => {
    //Chama a função duas vezes, para que remova e readicione o viewTodoList.
     viewTodoList.appendOrRemoveViewTodolist();
     viewTodoList.appendOrRemoveViewTodolist();

  }; 

  export default atualizaViewTodoList; 