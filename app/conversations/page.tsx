"use client";

import clsx from "clsx";
import useCoversation from "../hooks/useCoversation";

import EmptyState from "../components/EmptyState";

const Home = () =>{
    const {isOpen} = useCoversation();

    return(
        <div>
            <EmptyState/>
        </div>
    )
}
export default  Home;
