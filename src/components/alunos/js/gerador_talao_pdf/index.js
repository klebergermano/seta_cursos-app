const pdf = require('html-pdf');
const path = require('path');
const pdfTemplate = require('./pdfTemplate');

module.exports =  function (data){
    return new Promise((resolve, reject)=>{
        pdf.create(pdfTemplate(data))
        .toFile(path.join('./generate_pdf/pdf_result/result.pdf'), 
        (err, res)=>{
            if(err) reject();
            else  resolve(res)   
        });
    })
    }