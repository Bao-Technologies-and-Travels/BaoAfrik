import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false, reconnect: () => { } });

// Keep socket instance outside component to survive React Strict Mode double-mounting
let globalSocket: Socket | null = null;
let globalSocketUserId: string | null = null;
let isConnecting = false;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(globalSocket);
    const [isConnected, setIsConnected] = useState(globalSocket?.connected || false);
    const mountedRef = useRef(true);

    const connectSocket = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return null;
        }

        // Prevent multiple simultaneous connection attempts
        if (isConnecting) {
            return globalSocket;
        }

        // Decode token to get user ID for comparison
        let tokenUserId: string | null = null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            tokenUserId = payload.userId || payload.id || payload.sub;
        } catch (e) {
            // Ignore decode errors
        }

        // If we already have a connected socket for the same user, reuse it
        if (globalSocket && globalSocketUserId === tokenUserId) {
            if (globalSocket.connected) {
                setSocket(globalSocket);
                setIsConnected(true);
                return globalSocket;
            }
            // Socket exists but disconnected - try to reconnect
            if (!globalSocket.connected && !isConnecting) {
                globalSocket.connect();
                setSocket(globalSocket);
                return globalSocket;
            }
        }

        // Clean up existing socket if it's for a different user
        if (globalSocket && globalSocketUserId !== tokenUserId) {
            globalSocket.removeAllListeners();
            globalSocket.disconnect();
            globalSocket = null;
            globalSocketUserId = null;
        }

        // Create new socket
        isConnecting = true;
        const socketUrl = process.env.REACT_APP_WS_URL || 'http://localhost:3001';
        const s = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 500,
            reconnectionDelayMax: 3000,
            timeout: 10000,
            autoConnect: true,
            forceNew: false
        });

        s.on('connect', () => {
            isConnecting = false;
            if (mountedRef.current) {
                setIsConnected(true);
            }
        });

        s.on('disconnect', (reason) => {
            if (mountedRef.current) {
                setIsConnected(false);
            }
            // Auto-reconnect unless server explicitly disconnected us
            if (reason === 'io server disconnect') {
                s.connect();
            }
        });

        s.on('connect_error', (error) => {
            isConnecting = false;
            console.error('Socket connection error:', error.message);
            if (mountedRef.current) {
                setIsConnected(false);
            }
        });

        s.on('connected', () => {
            isConnecting = false;
            if (mountedRef.current) {
                setIsConnected(true);
            }
        });

        globalSocket = s;
        globalSocketUserId = tokenUserId;
        setSocket(s);
        return s;
    }, []);

    const reconnect = useCallback(() => {
        if (globalSocket) {
            // If already connected, just update state
            if (globalSocket.connected) {
                setSocket(globalSocket);
                setIsConnected(true);
                return;
            }
            // Try to reconnect existing socket
            globalSocket.connect();
            return;
        }
        // Create new socket
        connectSocket();
    }, [connectSocket]);

    useEffect(() => {
        mountedRef.current = true;
        
        // Connect immediately on mount
        const s = connectSocket();
        
        // Ensure socket state is set immediately if socket exists
        if (s) {
            setSocket(s);
            setIsConnected(s.connected);
        }

        return () => {
            mountedRef.current = false;
            // Don't disconnect on unmount - keep socket alive for reuse
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Reconnect when token changes (e.g., after login)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                // Force new connection for new user
                if (globalSocket) {
                    globalSocket.removeAllListeners();
                    globalSocket.disconnect();
                    globalSocket = null;
                    globalSocketUserId = null;
                }
                setSocket(null);
                setIsConnected(false);
                connectSocket();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [connectSocket]);

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