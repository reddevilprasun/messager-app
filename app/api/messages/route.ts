import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";
export async function POST(request:Request) {
    try {
        const currenUser = await getCurrentUser();
        const body = await request.json();
        const{
            message,
            image,
            conversationId
        }= body;
        if(!currenUser?.id || !currenUser?.email ){
            return new NextResponse('Unauthorized',{status:401})
        }

        const newMessage = await prisma.message.create({
            data:{
                body:message,
                image:image,
                conversation:{
                    connect:{
                        id:conversationId
                    }
                },
                sender:{
                    connect:{
                        id:currenUser.id
                    }
                },
                seen:{
                    connect:{
                        id: currenUser.id
                    }
                }
            },
            include:{
                seen:true,
                sender: true
            }
        });
        const updatedCoversation = await prisma.conversation.update({
            where:{
                id:conversationId
            },
            data:{
                lastMessage:new Date(),
                messages:{
                    connect:{
                        id:newMessage.id
                    }
                }
            },
            include:{
                users:true,
                messages:{
                    include:{
                        seen:true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedCoversation.messages[updatedCoversation.messages.length -1];
        updatedCoversation.users.map((user)=>{
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                message: [lastMessage]
            })
        });
        return NextResponse.json(newMessage);
    } catch (error:any) {
        console.log(error,"ERROR_MESSAGES")
        return new NextResponse('Internal error',{status:500})
    }
}