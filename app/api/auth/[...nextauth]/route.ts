import bcrypt from "bcrypt"
import NextAuth, {AuthOptions} from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import prisma from "@/app/libs/prismadb"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
// interface MyCredentials{
//     email:string;
//     password:string;
// }
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "signin")  
            name:  'credentials',
            credentials:{
                email: {label: 'email' , type: 'text'},
                password: {label: 'Password', type:'password'}
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password ){
                    throw new Error('Email or Password not provided');
                }

                const user = await prisma.user.findUnique({
                    where :{
                        email: credentials.email
                    }
                });
                if (!user || !user.hashedPassword) {
                    throw  new Error("Incorrect email address or password");
                }
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );
                if (!isCorrectPassword) {
                    throw new Error("Incorrect email address or password");
                }
                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,   
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};