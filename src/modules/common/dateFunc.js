export function changeDateToYYYYMMDD(){

}
export function changeDateToDDMMYYYY(){


}
export function changeDateToDislayText(dateString){
let newDate = new Date(dateString);
newDate.setDate(newDate.getDate()+1);
newDate.setMonth(newDate.getMonth()+1);
let day = newDate.getDate();
let year = newDate.getFullYear();
let month = newDate.getMonth();

day = day.toString().padStart('2', '0');
month = month.toString().padStart('2', '0');
let changedDate = `${day}/${month}/${year}`;

let n = ''+day;
let x = n.padStart('2', '0');
    return changedDate;

}