import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (
  conversationId: string
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {

      return null;
    }

    if(!conversationId){
        console.log("no convid")
        return null;
    }
  
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId, // Ensure conversationId is a string
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    console.error(error, 'SERVER_ERROR');
    console.log("This is the GCBI error");
    return null;
  }
};

export default getConversationById;
