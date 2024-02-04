
import getConversationById from "@/app/actions/getConversationById";
import getmessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
    coversationId: string;
};

const ConversationId = async ({ params }: { params: IParams }) => {
    const conversationId = params.conversationId; // Make sure this is a valid string
    const conversation = await getConversationById(conversationId);
    const message = await getmessages(params.coversationId)
    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }


    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={message} />
                <Form />
            </div>

        </div>
    )
}

export default ConversationId;
