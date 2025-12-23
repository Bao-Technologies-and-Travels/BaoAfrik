import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
    const connectSocket = () => {
        const token = localStorage.getItem('accessToken');

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
            console.log('Socket connected:', s.id);
        });

        s.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        s.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                s.connect();
            }
        });

        setSocket(s);
        return () => {
            s.off('connect');
            s.off('connect_error');
            s.off('disconnect');
            s.disconnect();
        };
    };
    const timer = setTimeout(connectSocket, 1000); 
    return () => {
        clearTimeout(timer);
    };
}, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);