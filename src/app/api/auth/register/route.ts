import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/user.model";


export async function POST (req: NextRequest)
{
    try
    {
        const data = await req.json();

        const email: string = data.email;
        const password: string = data.password;

        if (!email || !password)
        {
            return NextResponse.json(
                {error: "email/password missing"},
                {status: 400},
            );
        }

        await connectDB();

        const existingUser = await User.findOne({email});

        if (existingUser)
        {
            return NextResponse.json(
                {error: "email already registered"},
                {status: 400},
            );
        }

        await User.create({email, password});

        return NextResponse.json(
            {message: "user registered successfully"},
            {status: 201},
        );

    }
    catch (error)
    {
        return NextResponse.json(
            {error: "registration failed"},
            {status: 500},
        )
    }
}