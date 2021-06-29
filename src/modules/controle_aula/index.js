let aulas = document.querySelectorAll('.aulas');
aulas.forEach((element)=>{
   element.addEventListener('click', (e)=>{

       let parent =  element.parentElement;
        let children = Array.from(parent.children);
       
       children.forEach((item)=>{
          // item.classList.remove('open_aula');
       });
      e.target.classList.toggle('open_aula');
       
   });
});
