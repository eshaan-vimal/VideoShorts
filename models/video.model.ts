import mongoose from 'mongoose';


export const VID_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const


export interface VideoType
{
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoURL: string;
    thumbnailURL: string;
    controls?: boolean;
    transformation?: {
        height: number,
        width: number,
        quality?: number,
    };
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new mongoose.Schema<VideoType>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoURL: {
        type: String,
        required: true,
    },
    thumbnailURL: {
        type: String,
        required: true,
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformation: {
        width: {
            type: Number,
            default: VID_DIMENSIONS.width,
        },
        height: {
            type: Number,
            default: VID_DIMENSIONS.height,
        },
        quality: {
            type: Number,
            min: 1,
            max: 100,
        },
    },
},
{
    timestamps: true,
});


const Video = mongoose.models?.Video || mongoose.model<VideoType>('Video', videoSchema);
export default Video;