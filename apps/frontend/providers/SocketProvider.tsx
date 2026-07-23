"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

export const SocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  useEffect(() => {
    if (!userId) return;

    const backendUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5050";

    const socketInstance = ClientIO(backendUrl, {
      query: {
        userId: userId,
      },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {});

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", (err as Error).message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
