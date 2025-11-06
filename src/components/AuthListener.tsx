import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthLogoutEvent extends CustomEvent {
    detail: {
        message: string;
        type: 'warning' | 'error' | 'info';
    };
}

declare global {
    interface Window {
        showToast?: (toast: any) => void;
    }
}

export const AuthListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = (event: AuthLogoutEvent) => {
            // Clear any additional local state if needed
            localStorage.clear();

            // Show toast notification if available
            if (window.showToast) {
                window.showToast({
                    type: event.detail?.type || 'warning',
                    title: 'Session Expired',
                    message: event.detail?.message || 'Your session has expired. Please log in again.',
                    duration: 5000,
                });
            }

            // Redirect to login
            navigate('/login', {
                replace: true,
                state: {
                    message: event.detail?.message || 'Your session has expired. Please log in again.',
                    type: event.detail?.type || 'warning'
                }
            });
        };

        // Listen for auth logout events
        window.addEventListener('auth:logout', handleLogout as EventListener);

        return () => {
            window.removeEventListener('auth:logout', handleLogout as EventListener);
        };
    }, [navigate]);

    return null;
};