import React, {createContext, useContext, useEffect, useState} from 'react';
import { io, Socket} from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode}> = ({ children}) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(!process.env.REACT_APP_WS_URL) {
            return;
        }

        const s = io(process.env.REACT_APP_WS_URL, {
            auth: { token},
            transports: ['webSocket', 'polling']
        });

        setSocket(s);

        return () => {
            try {
                s.disconnect();
            } catch (e) {
                // ignore
            }
            setSocket(null);
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);