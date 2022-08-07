import teste from "../../appContent/js/teste.js";
let element = document.createElement('div')

describe('teste for example', ()=>{
    test('expected to be something', ()=>{
        expect(teste.changeBorder(element)).toBe(2);
    })  
})

