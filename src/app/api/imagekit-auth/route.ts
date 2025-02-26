import ImageKit from 'imagekit';
import { NextRequest, NextResponse } from 'next/server';


const imageKit: ImageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL!,
});

export async function GET (req: NextRequest)
{
    try
    {
        return NextResponse.json(imageKit.getAuthenticationParameters());
    }
    catch (error)
    {
        return NextResponse.json(
            {error: "imagekit authorization failed"},
            {status: 500},
        );
    }
}