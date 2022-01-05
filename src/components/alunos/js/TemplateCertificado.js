
const TemplateCertificado = (certificadoInfo)=>{
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
              <p class='p_curso'>Certificamos que <span id='aluno'>Fulano de Tal</span>, concluiu com êxito o curso de <span id='curso'>Informática Completo</span></p>
              <p  class='p_modulos'>Módulos: <span id='modulos'>Introdução a Informática, Dispositivos, Pacote Office, Atualização e Formatação, Instalação de Programas, Windows, Redes, Digitação, Hardware, Internet, Backup e Segurança, Gerenciamento de Dados, Inglês Instrumental, 
                  Lógica de Programação e Introdução a: HTML, CSS, JS, Photoshop.</span></p>
              <p>Carga horária: <span id='horas'>96 horas</span></p>
              <p>Início: <span id='inicio'>25/08/2020</span></p>
              <p>Local: <span id='endereco'>Rua Gustavo Bacarisas, nº8 - Sala 3 - Jd. Zilda - São Paulo - SP</span></p>
            </div>
            <div id='bg_info_2' class='bg_info'>
                <p>Para verificar a validade desse certificado acesse</p>
                <p><span id='site'>www.setacursos.com.br/certificados</span> e digite o código <span id='cod'>IB1325</span></p>
                <p>Data de emissão: 02/12/2020</p>
               
                      </div>
          </div><!--page-->
    
         
          <div class='model'>
    
        </div><!--page-->
          
    
        </body>
    </html>
    

    `);

}


module.exports = TemplateCertificado; 

