
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";

export async function POST(
    request: Request
) {
    try {
        const CurrentUser = await getCurrentUser();
        const body = await request.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        if (!CurrentUser?.id || !CurrentUser?.email) {
            return new NextResponse('Unauthorized', { status: 400 })
        }
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid Group Data!', { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: CurrentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            });
            newConversation.users.forEach((user)=>{
                if(user.email){
                    pusherServer.trigger(user.email,'conversation:new',newConversation)
                }
            })
            return NextResponse.json(newConversation);

        }

        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [CurrentUser.id, userId]
                        }
                    },
                    {
                        userIds:{
                            equals:[userId,CurrentUser.id]
                        }
                    }
                ]
            }
        });
        const singleConversation = existingConversations[0];
        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }

        const nweConversation = await prisma.conversation.create({
            data: {
                users:{
                    connect:[
                        {
                            id: CurrentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include:{
                users:true
            }
        });

        nweConversation.users.map((user)=>{
            if(user.email){
                pusherServer.trigger(user.email, 'conversation:new', nweConversation)
            }
        })
        return  NextResponse.json(nweConversation);


    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}