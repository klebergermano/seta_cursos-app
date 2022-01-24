export function changeDateTextToYYYYMMDD(dateString){

let arrayDate = dateString.split('/');
let newDate = arrayDate[2]+'-'+(arrayDate[1])+'-'+arrayDate[0];
return newDate;
}



export function setCurrentDate(idInput) {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ((currentDate.getMonth() + 1).toString()).padStart(2, '0');
  let day = ((currentDate.getDate()).toString()).padStart(2, '0');
  let fcurrentDate = year + '-' + month + '-' + day;
  document.querySelector(idInput).value = fcurrentDate;
}

export function changeDateToDislayTextDatetime(datetime){

  console.log(datetime.toLocaleDateString('pt-BR'));
  let time = new Date(datetime.getTime()).toLocaleTimeString("en-US"); 
let day = datetime.getDate();
let year = datetime.getFullYear();
let month = (datetime.getMonth() +1);
day = day.toString().padStart('2', '0');
month = month.toString().padStart('2', '0');
let changedDate = `${day}/${month}/${year}`;


      return changedDate;
  
}
export function changeDateToDislayText(dateString){
let newDate = new Date(dateString + ',00:00:00');
let day = newDate.getDate();
let year = newDate.getFullYear();
let month = (newDate.getMonth() +1);

day = day.toString().padStart('2', '0');
month = month.toString().padStart('2', '0');
let changedDate = `${day}/${month}/${year}`;
/*
let n = ''+day;
let x = n.padStart('2', '0');
*/
    return changedDate;
}

export function converteMesNumeroPorExtenso(mes) {
    let monthName = '';
    switch (mes) {
      case 1: monthName = 'janeiro';
        break;
      case 2: monthName = 'fevereiro';
        break;
      case 3: monthName = 'março';
        break;
      case 4: monthName = 'abril';
        break;
      case 5: monthName = 'maio';
        break;
      case 6: monthName = 'junho';
        break;
      case 7: monthName = 'julho';
        break;
      case 8: monthName = 'agosto';
        break;
      case 9: monthName = 'setembro';
        break;
      case 10: monthName = 'outubro';
        break;
      case 11: monthName = 'novembro';
        break;
      case 12: monthName = 'dezembro';
        break;
    }
    return monthName;
  }
