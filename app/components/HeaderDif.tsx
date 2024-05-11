import React, { useState, useEffect } from 'react';
import { getAccessToken } from "../lib/actions";
import { getUserId } from "../lib/actions";
import Header from "./Header";


const HeaderDif = async () => {
    const userId = await getUserId();
    const token = await getAccessToken();

    if (!userId || !token) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
            </main>
        )
    }

    return (
        <main className='pl-[56px]'>
            <Header />
        </main>
    )
}

export default HeaderDif;

