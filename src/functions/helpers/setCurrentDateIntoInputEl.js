const setCurrentDateIntoInputEl = (inputDate)=>{
    inputDate.value = new Date().toISOString().substring(0, 10); 
}

export default setCurrentDateIntoInputEl; 