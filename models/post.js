import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fileLink: {
            type: String,
            required: [true, 'File link is required'],
        },
        fileName: {
            type: String,
            required: [true, 'File name is required'],
        },
        fileType: {
            type: String,
            required: [true, 'File type is required'],
        },
        fileSize: {
            type: Number, // Size in bytes
            required: [true, 'File size is required'],
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

const Post = models.Post || model('Post', PostSchema);

export default Post;
