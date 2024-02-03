"use client";

import clsx from "clsx";
import useCoversation from "../hooks/useCoversation";

import EmptyState from "../components/EmptyState";

const Home = () =>{
    const {isOpen} = useCoversation();

    return(
        <div
        className={clsx(
            "lg:pl-80 h-full lg:block",
            isOpen ? 'block' : 'hidden'
        )}
        >
            <EmptyState/>
        </div>
    )
}
export default  Home;
