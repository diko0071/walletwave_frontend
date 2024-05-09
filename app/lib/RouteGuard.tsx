'use client';
import { useRouter } from 'next/navigation'; 
import { useEffect, useState, ReactNode } from 'react';
import { getUserId, getAccessToken } from './actions'; 

const RouteGuard = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const userId = await getUserId();
            const token = await getAccessToken();

            if (userId && token) {
                setAuthorized(true);
            } else {
                setAuthorized(false);
                router.replace('/login');
            }
        };

        checkAuth(); 

    }, [router]);

    return authorized ? <>{children}</> : null;
};

export default RouteGuard;