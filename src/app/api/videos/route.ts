import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/utils/db";
import User from "@/models/user.model";
import { authOptions } from "@/utils/auth";
import Video, { VideoType } from "@/models/video.model";



export async function GET ()
{
    try
    {
        connectDB();

        const videos = await User.find({}).sort({createdAt: -1}).lean();

        if (!videos || videos.length === 0)
        {
            return NextResponse.json(
                {data: []},
                {status: 200},
            );
        }

        return NextResponse.json(
            {data: videos},
            {status: 200},
        );
    }
    catch (error)
    {
        return NextResponse.json(
            {error: "failed to fetch videos"},
            {status: 500},
        );
    }
}


export async function POST (req: NextRequest)
{
    try
    {
        const session = await getServerSession(authOptions);

        if (!session)
        {
            return NextResponse.json(
                {error: "unauthorized"},
                {status: 401},
            );
        }

        await connectDB();

        const body:VideoType = await req.json();

        if (!body.title || !body.description || !body.videoURL || !body.thumbnailURL)
        {
            return NextResponse.json(
                {error: "missing required fields"},
                {status: 400},
            );
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            trasnsformation: {
                quality: body.transformation?.quality ?? 100,
            }
        };

        const newVideo = await Video.create(videoData);
        
        return NextResponse.json(
            {data: newVideo},
            {status: 200},
        );
    }
    catch (error)
    {
        return NextResponse.json(
            {error: "failed to upload video"},
            {status: 500},
        );
    }
}