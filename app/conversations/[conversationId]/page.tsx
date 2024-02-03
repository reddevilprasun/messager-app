
import getConversationById from "@/app/actions/getConversationById";
import getmessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";

interface IParams{
    coversationId: string;
};

const ConversationId = async ({params}: {params: IParams}) =>{
    const conversation = await getConversationById(params.coversationId);
    const message = await getmessages(params.coversationId)
    if(!conversation){
        return(
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState/>
                </div>
            </div>
        );
    }


    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation}/>
            </div>

        </div>
    )
}

export default  ConversationId;
