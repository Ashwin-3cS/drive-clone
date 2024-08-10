import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { connectTodb } from '@/utils/connectToDb';
import Post from '@/models/post';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

async function uploadFiletoS3(file) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    console.log(`Uploading file: ${fileName} as ${uniqueFileName}`);

    // Get the MIME type based on the file extension
    const contentType = mime.lookup(fileName) || 'application/octet-stream';
    console.log(`Detected MIME type: ${contentType}`);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `user-files/${uniqueFileName}-${Date.now()}`,
        Body: fileBuffer,
        ContentType: contentType  // Use the detected MIME type
    };

    try {
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`File uploaded successfully. S3 Response: ${JSON.stringify(response)}`);
        
        const fileKey = params.Key;
        console.log(`File stored in S3 with key: ${fileKey}`);
        
        return { fileName, fileKey, contentType };
        
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw error; 
    }
}

export const POST = async (request, { params }) => {
    try {
        console.log('Received POST request');
        const formData = await request.formData();
        const file = formData.get('file');

        const { id: userId } = params;
        console.log(`User ID: ${userId}`);

        if (!file) {
            console.error('File is missing in the request');
            return NextResponse.json({ error: 'File is missing' }, { status: 400 });
        }

        console.log('File received. Proceeding with S3 upload.');
        const { fileName, fileKey, contentType } = await uploadFiletoS3(file);

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`; 
        console.log(`File URL: ${fileUrl}`);

        await connectTodb();
        console.log('Connected to database');

        const newPost = new Post({
            creator: userId,
            fileLink: fileUrl,
            fileName: fileName,
            fileType: contentType
        });

        await newPost.save();
        console.log('New post saved to database');

        return NextResponse.json({ success: true, newPost }, { status: 200 });

    } catch (error) {
        console.error('Post Creation Error:', error);
        return NextResponse.json({ error: "Failed to create a new Post", details: error.message }, { status: 500 });
    }
};
