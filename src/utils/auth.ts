import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "@/utils/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
            
            name: "Credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize (credentials, req)
            {
                if (!credentials?.email || !credentials?.password)
                {
                    throw new Error("missing email/password");
                }

                try
                {
                    await connectDB();

                    const user = await User.findOne({email: credentials.email});

                    if (!user)
                    {
                        throw new Error("user not found");
                    }

                    const isValid: boolean = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid)
                    {
                        throw new Error("invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                    }
                }
                catch (error)
                {
                    throw error;
                }
            },

        }),
    ],

    callbacks: {

        async jwt ({token, user}) {

            if (user)
            {
                token.id = user.id;
            }

            return token;
        },

        async session ({session, token}) {
            
            if (session.user)
            {
                session.user.id = token.id as string;
            }

            return session;
        },

    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 30*24*60*60,
    },

    secret: process.env.NEXTAUTH_SECRET,
};