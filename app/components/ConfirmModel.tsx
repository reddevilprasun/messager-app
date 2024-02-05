"use client";

import { useRouter } from "next/navigation";
import useCoversation from "../hooks/useCoversation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Model from "./Model";
import {FiAlertTriangle} from "react-icons/fi"
import { Dialog } from "@headlessui/react";
import Button from "./button";

interface ConfirmModelProps{
    isOpen?: boolean;
    onClose: ()=> void;
}

const ConfirmModel:React.FC<ConfirmModelProps> = ({
    isOpen,
    onClose,

}) => {
    const route = useRouter();
    const { conversationId} = useCoversation();
    const [isLoading , setIsLoading] = useState(false);

    const onDelete = useCallback(()=>{
        setIsLoading(true);
        axios.delete(`/api/conversations/${conversationId}`)
        .then(()=>{
            onClose();
            route.push('/conversations');
            route.refresh();
        })
        .catch(()=> toast.error('Someting went wrong!'))
        .finally(()=> setIsLoading(false))

    }, [conversationId,route, onClose])

    return ( 
        <div>
            <Model isOpen={isOpen} onClose={onClose}>
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto justify-center flex h-12 w-12 flex-shrink-0 items-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <FiAlertTriangle
                            className="h-6 w-6 text-red-600"
                        />
                    </div>
                    <div className=" mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Delete conversations

                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Are you  sure you want to delete this conversation? This action cannot be undone.</p>

                        </div>

                    </div>
                </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button disabled={isLoading} danger onClick={onDelete}>
                    Delete
                </Button>
                <Button disabled={isLoading} secondary onClick={onClose}>
                    Cancel
                </Button>
            </div>
            </Model>
        </div>
     );
}
 
export default ConfirmModel;