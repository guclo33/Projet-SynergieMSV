require('dotenv').config(); 
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = (filePath) => {
    
    const fileContent = fs.readFileSync(filePath);
    const key = `Synergia/${path.basename(filePath)}`;
  
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(`Erreur d'upload pour ${filePath}:`, err);
      } else {
        console.log(`Fichier ${filePath} uploadé sur S3 : ${data.Location}`);
      }
    });
  };

module.exports = s3Client, uploadFileToS3; 