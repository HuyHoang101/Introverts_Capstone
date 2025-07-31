import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadFileToS3 = async (file, folder = "misc") => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('File upload failed');
    }
};

export const deleteFileFromS3 = async (fileUrl) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    // Extract the file name from the URL
    const fileName = fileUrl.split('.amazonaws.com/')[1];

    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        return true;
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('File deletion failed');
    }
};