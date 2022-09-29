// Reseta o el do tipo date mais proximo do event.target.
const resetSimblingElInputDate = (e) => {
     const parent = e.target.parentElement; 
     const inputDate = parent.querySelector('input[type="date"]'); 
          if(inputDate) inputDate.value=''; 
  }

export default resetSimblingElInputDate; 