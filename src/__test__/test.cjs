const myDragons = {
    dragon1 : 'Dragon fire',
    dragon2 : 'Dragon ice',
    dragon3 : 'Dragon earth',
}

for(let drag of myDragons){
    console.log(drag)
}
console.log(['casa', 'test'])

function loopDrag(){
let count = 1; 
let loop = {
    [Symbol.iterator]: ()=>{
        return{
            next: ()=>{
                count ++; 
            }
        }

    }
}

}