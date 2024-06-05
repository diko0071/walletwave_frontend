import React, { useState, useEffect } from 'react';
import { getAccessToken } from "../lib/actions";
import { getUserId } from "../lib/actions";
import Header from "./Header";
import { Navbar } from "./Landing Page/Navbar";


const HeaderDif = async () => {
    const userId = await getUserId();
    const token = await getAccessToken();

    if (!userId || !token) {
        return (
            <main>
                <Navbar />
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

