// utils/auth.js

import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export function withAuth(Component:any) {
    return function AuthenticatedComponent(props:any) {
        const router = useRouter();

        // Check if token exists
        const token = Cookies.get('token');
        if (!token) {
            // Redirect to login if token doesn't exist
            router.push('/login');
            return null;
        }

        // If token exists, render the component
        return Component
    };
}
