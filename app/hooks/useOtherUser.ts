import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {
    users: User[],

})=>{
    const session = useSession();
    const otheruser = useMemo(()=>{
        const currentUserEmail = session?.data?.user?.email;
        const otheruser = conversation.users.filter((user)=> user.email !== currentUserEmail);
        return otheruser[0];
    },[session?.data?.user?.email, conversation.users])
    return  otheruser;
};

export default  useOtherUser;