import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUser } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useCoversation from "./useCoversation";

const useRoutes = () => {
    const pathname = usePathname();
    const { conversationId } = useCoversation();

    const routes = useMemo(() => [
        {

            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            active: pathname === '/conversations' || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUser,
            active: pathname === '/users'
        },
        {
            label: 'Logout',
            onClick: () => signOut(),
            href: '#',
            icon: HiArrowLeftOnRectangle,
        }
    ], [pathname, conversationId])
    return routes;
}

export default useRoutes;