import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { connectTodb } from '@/utils/connectToDb';
import Post from '@/models/post';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

async function deleteFileFromS3(fileKey) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        console.log('File deleted successfully');
    } catch (error) {
        console.error('S3 Deletion Error:', error);
        throw error;
    }
}

export const DELETE = async (request, { params }) => {
    try {
        const { id: postId } = params;

        await connectTodb();
        const post = await Post.findById(postId);   

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Extract fileKey from the post data
        const fileKey = post.fileLink.split(`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1];
        
        await deleteFileFromS3(fileKey);

        // Delete the post from the database
        await Post.findByIdAndDelete(postId);

        return NextResponse.json({ success: true, message: 'File and post deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Post Deletion Error:', error);
        return NextResponse.json({ error: 'Failed to delete the post and file', details: error.message }, { status: 500 });
    }
};
