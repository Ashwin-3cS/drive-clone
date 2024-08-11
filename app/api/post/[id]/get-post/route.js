import { NextResponse } from 'next/server';
import { connectTodb } from '@/utils/connectToDb';
import Post from '@/models/post';

export const GET = async (request, { params }) => {
    try {
        console.log('Received GET request');
        const { id: userId } = params;
        console.log(`User ID: ${userId}`);

        await connectTodb();
        console.log('Connected to database');

        // Fetch posts associated with the userId
        const posts = await Post.find({ creator: userId }).sort({ createdAt: -1 });
        console.log(`Fetched ${posts.length} posts for user ${userId}`);

        if (!posts || posts.length === 0) {
            return NextResponse.json({ message: 'No posts found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, posts }, { status: 200 });

    } catch (error) {
        console.error('Get Posts Error:', error);
        return NextResponse.json({ error: "Failed to fetch posts", details: error.message }, { status: 500 });
    }
};
