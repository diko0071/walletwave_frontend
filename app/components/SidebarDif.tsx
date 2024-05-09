import React, { useState, useEffect } from 'react';
import { getAccessToken } from "../lib/actions";
import { getUserId } from "../lib/actions";
import Header from "./Header";
import Sidebar from './Sidebar';


const SidebarDif = async () => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <div>
            </div>
        )
    }
    return (
        <main className="flex items-start justify-between">
            <Sidebar />
        </main>
    )
}

export default SidebarDif;