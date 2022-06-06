
function changeDateToDislayText(dateString) {
    let newDate = new Date(dateString + ',00:00:00');
    let day = newDate.getDate();
    let year = newDate.getFullYear();
    let month = (newDate.getMonth() + 1);
    day = day.toString().padStart('2', '0');
    month = month.toString().padStart('2', '0');
    let changedDate = `${day}/${month}/${year}`;
    return changedDate;
}


const TemplateCertificado = (certificadoInfo) => {
    console.log('--------------------------------------------------------------------');
    console.log(certificadoInfo);
    console.log('--------------------------------------------------------------------');


    return (`
    <!DOCTYPE html>
    <html lang="pt-br">
    
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Template Aluno</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');
            </style>
    
            <style>
            
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                  
                    font-family: 'Noto Sans', sans-serif;
                }
           
                #logo {
                    width: 100%;
                    max-height: 200px;
                    margin: 0;
                }
                .page {
                    position: relative;
                    height: 21cm;
                    width: 29.6cm;
                    background: #ccc;
                    padding: 260px 110px 90px 120px;
                    margin: 0 auto;
                    background: #fff;
                    background:url("https://firebasestorage.googleapis.com/v0/b/app-seta-cursos.appspot.com/o/Certificado%20SETA%20Background.jpg?alt=media&token=78034f8d-9cf6-44ef-9002-0cb4573bf8b1");
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
              
                }
                .bg_info{
                 width:100%; 
                }
                #bg_info_1{ }
                .p_curso{
                    font-size:16pt !important;
                }
                .p_modulos{
                    padding:8pt 0px 8pt 0px;
                    font-weight:bold;
                }
                #bg_info_2{
                  margin-top:90px;
                  position:absolute;
                  bottom:2.6cm; 
                  font-size:13pt;
                }
                #curso{ text-transform: uppercase; font-weight: bold;}
                #aluno, #horas, #inicio, #site, #cod{font-weight: bold;}
                #modulos{ line-height: 16pt; font-style:italic !important; font-weight:normal;}
            </style>
            <script src='./scirpt.js' defer></script>
        </head>
        <body>
          <div class='page'>
              <div id='bg_info_1' class='bg_info'>
              <p class='p_curso'>Certificamos que <span id='aluno'>${certificadoInfo.aluno_nome}</span>, 
              concluiu com êxito o curso de <span id='curso'>${certificadoInfo.curso_nome}</span></p>
              <p  class='p_modulos'>Módulos: <span id='modulos'>${certificadoInfo.curso_modulos}</span></p>
              <p>Carga horária: <span id='horas'>${certificadoInfo.curso_carga_horaria} horas</span></p>
              <p>Início: <span id='inicio'>${changeDateToDislayText(certificadoInfo.curso_inicio)}</span></p>
              <p>Local: <span id='endereco'>${certificadoInfo.endereco}</span></p>
            </div>
            <div id='bg_info_2' class='bg_info'>
                <p>Para verificar a validade desse certificado acesse</p>
                <p><span id='site'>www.setacursos.com.br/certificados</span> e digite o código <span id='cod'>${certificadoInfo.certificado_cod}</span></p>
                <p>Data de emissão:<b>${changeDateToDislayText(certificadoInfo.data_emissao)}</b></p>
                      </div>
          </div><!--page-->
          <div class='model'>
        </div><!--page-->
        </body>
    </html>
    `);
}

module.exports = TemplateCertificado;

