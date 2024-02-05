import getCurrentUser from "@/app/actions/getCurrentUser";
import {NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
export async function POST(
    request:Request
){
    try {
        const currentuser = await getCurrentUser();
        const body = await request.json();
        const {
            name,
            image
        } = body;

        if(!currentuser){
            return new NextResponse('unauthorizd',{status: 401})
        }

        const updatedUser = await prisma.user.update({
            where:{id : currentuser.id},
            data:{
                image:image,
                name:name
            }
        })
        return NextResponse.json(updatedUser);
    } catch (error:any) {
        console.log(error,'ERROR_SETTINGS');
        return new NextResponse('Internal Error', {status: 500})
    }
}