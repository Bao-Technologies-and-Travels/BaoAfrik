import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false, reconnect: () => {} });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log('No token, skipping socket connection');
            return null;
        }

        const socketUrl = process.env.REACT_APP_WS_URL || 'http://localhost:3001';
        const s = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            forceNew: true
        });

        s.on('connect', () => {
            setIsConnected(true);
        });

        s.on('disconnect', (reason) => {
            setIsConnected(false);
        });

        s.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            setIsConnected(false);
        });

        s.on('connected', (data) => {
            setIsConnected(true);
        });

        setSocket(s);
        return s;
    }, []);

    const reconnect = useCallback(() => {
        if (socket) {
            socket.disconnect();
        }
        connectSocket();
    }, [socket, connectSocket]);

    useEffect(() => {
        const s = connectSocket();

        return () => {
            if (s) {
                s.off('connect');
                s.off('connect_error');
                s.off('disconnect');
                s.off('connected');
                s.disconnect();
            }
        };
    }, [connectSocket]);

    // Reconnect when token changes (e.g., after login)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                reconnect();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [reconnect]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    return context.socket;
};

export const useSocketContext = () => useContext(SocketContext);