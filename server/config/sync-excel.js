const chokidar = require('chokidar');
const {uploadFileToS3} = require('./s3-config')

const watcher = chokidar.watch('C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx', { persistent: true });



watcher.on('change', (filePath) => {

  uploadFileToS3(filePath); 
});