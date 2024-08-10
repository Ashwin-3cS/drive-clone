import { NextResponse } from 'next/server';
import { connectTodb } from '@/utils/connectToDb';
import Post from '@/models/post';

export const PUT = async (request, { params }) => {
    try {
        await connectTodb();
        
        const { id: postId } = params;
        const { newFileName } = await request.json();
        
        if (!newFileName) {
            return NextResponse.json({ error: 'New file name is required' }, { status: 400 });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        post.fileName = newFileName;
        await post.save();

        return NextResponse.json({ success: true, post }, { status: 200 });

    } catch (error) {
        console.error('Rename Error:', error);
        return NextResponse.json({ error: "Failed to rename the file", details: error.message }, { status: 500 });
    }
};
