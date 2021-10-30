
const { app, BrowserWindow, Menu, ipcMain, globalShortcut, Tray, dialog } = require("electron");

const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const downloadPath = app.getPath("downloads");
const TemplateContrato = require("./components/contratos/js/TemplateContrato.js");
const TemplateHistoricoAluno = require("./components/controleAula/js/TemplateHistoricoAluno.js");


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1470,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//-------------------------------------------------------------------------------------//
//-----------------------------------------ALUNO HISTORICO PDF ------------------------//
//-------------------------------------------------------------------------------------//


function createPDFHistoricoAluno(docAlunoHistorico) {
  var options = { 
    "format": "A4",
    "base": "file:///D:/#KG/seta_cursos-app/src/assets/"
    
    }

  const templateHistorico = TemplateHistoricoAluno(docAlunoHistorico); // create template from the form inputs
  return new Promise((resolve, reject) => {
    pdf
      .create(templateHistorico, options)
      .toFile(path.join(__dirname, "hitoricoAluno.pdf"), (err, res) => {
        if (err) reject();
        else resolve(res);
      });
  });
}


ipcMain.handle("baixarHistoricoAluno", async (event, docAlunoHistorico) => {


  let novoPDF = createPDFHistoricoAluno(docAlunoHistorico); // call the createPDF function

  novoPDF.then((pdf) => {
    // Read the file
    let filename = `${docAlunoHistorico.nome}_${docAlunoHistorico.curso}_historico.pdf`;
    filename = filename.toUpperCase();
    let oldpath = `${__dirname}/hitoricoAluno.pdf`;
    let newpath = `${downloadPath}/${filename}`;
    fs.readFile(oldpath, function (err, data) {
      if (err) throw err;
      console.log("File read!");

      // Write the file
      fs.writeFile(newpath, data, function (err) {
        if (err) throw err;
        console.log("File written!");
        dialog.showMessageBoxSync({
          type: "info",
          title: "SETA CURSOS - Histórico de Aluno",
          message: `Historico do Aluno salvo com sucesso em: ${downloadPath}`,
        });
      });
      // Delete the file
      fs.unlink(oldpath, function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });
    });
  })
});

//-------------------------------------------------------------------------------------//
//---------------------------------------- CONTRATO PDF -------------------------------//
//-------------------------------------------------------------------------------------//

//create PDF
function createPDF(data) {
  const templateContrato = TemplateContrato(data); // create template from the form inputs
  return new Promise((resolve, reject) => {
    pdf
      .create(templateContrato)
      .toFile(path.join(__dirname, "result.pdf"), (err, res) => {
        if (err) reject();
        else resolve(res);
      });
  });
}
ipcMain.handle("submit", async (event, data_info) => {

  const novoPDF = createPDF(data_info); // call the createPDF function

  return novoPDF
    .then((pdf) => {
      // Read the file
      let filename = `${data_info.resp_nome}-${data_info.curso_nome}-CONTRATO.pdf`;
      filename = filename.toUpperCase();
      let oldpath = `${__dirname}/result.pdf`;
      let newpath = `${downloadPath}/${filename}`;

      fs.readFile(oldpath, function (err, data) {
        if (err) throw err;
        console.log("File read!");

        // Write the file
        fs.writeFile(newpath, data, function (err) {
          if (err) throw err;
          console.log("File written!");
          dialog.showMessageBoxSync({
            type: "info",
            title: "SETA CURSOS - Contrato",
            message: `Contrato gerado com sucesso em: ${downloadPath}`,
          });
        });
        // Delete the file
        fs.unlink(oldpath, function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

